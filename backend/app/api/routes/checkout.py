from fastapi import APIRouter, Depends, HTTPException, Request, Response, Body
from fastapi.responses import RedirectResponse
from app.models import User, SubscriptionStatus
from app.db.session import get_db
from sqlalchemy.orm import Session
from typing import Annotated, Dict, Optional
from pydantic import BaseModel
import stripe
from stripe.error import StripeError
import os
import logging
from app.api.deps import get_current_user
from app.core.security import create_session_token, verify_session_token
from starlette.responses import JSONResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Stripe API key
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
stripe.api_version = "2023-10-16"  # Use stable version to avoid issues

# Create router
router = APIRouter(tags=["checkout"])

# Define price ID constants for your subscription tiers
BASIC_TIER_PRICE_ID = os.getenv("STRIPE_BASIC_TIER_PRICE_ID")
PRO_TIER_PRICE_ID = os.getenv("STRIPE_PRO_TIER_PRICE_ID")
ENTERPRISE_TIER_PRICE_ID = os.getenv("STRIPE_ENTERPRISE_TIER_PRICE_ID")

# Your application base URL
APP_BASE_URL = os.getenv("APP_BASE_URL", "http://localhost:3000")

class CheckoutSessionRequest(BaseModel):
    tier: str = "basic"  # Default to basic tier
    success_path: str = "/dashboard"  # Default dashboard redirect
    cancel_path: str = "/pricing"  # Default to pricing page on cancel

@router.post("/create-checkout-session", response_class=JSONResponse)
async def create_checkout_session(
    request: Request,
    checkout_data: CheckoutSessionRequest,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)]
):
    """
    Create a Stripe Checkout Session and return the session URL.
    User will be redirected to Stripe for payment and then back to your app.
    """
    logger.info(f"Creating checkout session for user: {current_user.email}, tier: {checkout_data.tier}")
    
    # Determine which price ID to use based on the requested tier
    if checkout_data.tier == "pro":
        price_id = PRO_TIER_PRICE_ID
    elif checkout_data.tier == "enterprise":
        price_id = ENTERPRISE_TIER_PRICE_ID
    else:  # Default to basic
        price_id = BASIC_TIER_PRICE_ID
    
    if not price_id:
        logger.error(f"Price ID not configured for tier: {checkout_data.tier}")
        raise HTTPException(status_code=500, detail=f"Price ID not configured for tier: {checkout_data.tier}")
    
    # Create or retrieve customer in Stripe
    try:
        if not current_user.stripe_customer_id:
            # Create new customer in Stripe
            customer = stripe.Customer.create(
                email=current_user.email,
                name=f"{current_user.first_name} {current_user.last_name}" if hasattr(current_user, "first_name") else current_user.email,
                metadata={"user_id": str(current_user.id)}
            )
            
            # Update user record with Stripe customer ID
            current_user.stripe_customer_id = customer.id
            db.commit()
            logger.info(f"Created new Stripe customer: {customer.id} for user: {current_user.email}")
        else:
            logger.info(f"Using existing Stripe customer: {current_user.stripe_customer_id}")
    
    except StripeError as e:
        logger.error(f"Stripe error creating customer: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to create customer: {str(e)}")
    
    # Create session token to verify user when they return
    session_token = create_session_token(current_user.id)
    
    # Prepare success and cancel URLs with session token
    success_url = f"{APP_BASE_URL}{checkout_data.success_path}?session_id={{CHECKOUT_SESSION_ID}}&token={session_token}"
    cancel_url = f"{APP_BASE_URL}{checkout_data.cancel_path}?token={session_token}"
    
    # Create Stripe checkout session
    try:
        checkout_session = stripe.checkout.Session.create(
            customer=current_user.stripe_customer_id,
            payment_method_types=["card"],
            line_items=[
                {
                    "price": price_id,
                    "quantity": 1,
                },
            ],
            mode="subscription",
            success_url=success_url,
            cancel_url=cancel_url,
            client_reference_id=str(current_user.id),
            # Add metadata to track the source of this subscription
            metadata={
                "user_id": str(current_user.id),
                "tier": checkout_data.tier
            }
        )
        
        logger.info(f"Created checkout session: {checkout_session.id} for user: {current_user.email}")
        
        # Return the checkout session URL
        return {
            "checkout_url": checkout_session.url,
            "session_id": checkout_session.id
        }
        
    except StripeError as e:
        logger.error(f"Stripe error creating checkout session: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to create checkout session: {str(e)}")

@router.get("/subscription-success")
async def subscription_success(
    request: Request,
    session_id: str,
    token: str,
    db: Annotated[Session, Depends(get_db)]
):
    """
    Handle the user's return after successful Stripe checkout.
    Verify the session token and session_id, then redirect to the dashboard.
    """
    # Verify the session token
    user_id = verify_session_token(token)
    if not user_id:
        logger.warning(f"Invalid session token: {token}")
        return RedirectResponse(url=f"{APP_BASE_URL}/login?error=invalid_session")
    
    # Retrieve the user
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        logger.warning(f"User not found for ID: {user_id}")
        return RedirectResponse(url=f"{APP_BASE_URL}/login?error=user_not_found")
    
    # Verify the checkout session
    try:
        checkout_session = stripe.checkout.Session.retrieve(
            session_id,
            expand=["subscription"]
        )
        
        # Verify this session belongs to the user
        if checkout_session.client_reference_id != str(user.id):
            logger.warning(f"Session client_reference_id {checkout_session.client_reference_id} doesn't match user ID {user.id}")
            return RedirectResponse(url=f"{APP_BASE_URL}/dashboard?error=session_mismatch")
        
        # Make sure session is complete
        if checkout_session.status != "complete":
            logger.warning(f"Checkout session {session_id} is not complete. Status: {checkout_session.status}")
            return RedirectResponse(url=f"{APP_BASE_URL}/dashboard?error=session_incomplete")
        
        # Extract the subscription from the session
        subscription_id = checkout_session.subscription
        if subscription_id:
            # Store the subscription ID in the user record
            user.subscription_id = subscription_id
            db.commit()
            logger.info(f"Updated user {user.email} with subscription {subscription_id}")
        
        # Redirect to the dashboard with success message
        return RedirectResponse(url=f"{APP_BASE_URL}/dashboard?subscription=active")
        
    except StripeError as e:
        logger.error(f"Stripe error verifying checkout session: {str(e)}")
        return RedirectResponse(url=f"{APP_BASE_URL}/dashboard?error=stripe_error")

@router.get("/subscription-cancel")
async def subscription_cancel(
    request: Request,
    token: str
):
    """
    Handle user's return after canceling Stripe checkout.
    Verify the session token and redirect to the pricing page.
    """
    # Verify the session token
    user_id = verify_session_token(token)
    if not user_id:
        logger.warning(f"Invalid session token: {token}")
        return RedirectResponse(url=f"{APP_BASE_URL}/login?error=invalid_session")
    
    # Redirect to pricing page
    return RedirectResponse(url=f"{APP_BASE_URL}/pricing?status=canceled")

@router.get("/customer-portal")
async def create_customer_portal(
    request: Request,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Create a Stripe Customer Portal session for the user to manage their subscription.
    User will be redirected to Stripe Customer Portal.
    """
    if not current_user.stripe_customer_id:
        logger.warning(f"No Stripe customer ID for user: {current_user.email}")
        raise HTTPException(status_code=404, detail="No Stripe customer associated with this user")
    
    # Create session token
    session_token = create_session_token(current_user.id)
    
    # Create customer portal session
    try:
        portal_session = stripe.billing_portal.Session.create(
            customer=current_user.stripe_customer_id,
            return_url=f"{APP_BASE_URL}/dashboard?token={session_token}"
        )
        
        logger.info(f"Created customer portal session for user: {current_user.email}")
        
        # Return the portal URL
        return {"portal_url": portal_session.url}
        
    except StripeError as e:
        logger.error(f"Stripe error creating customer portal: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to create customer portal: {str(e)}")
