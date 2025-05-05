from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from fastapi.responses import RedirectResponse, JSONResponse
from app.models import User, SubscriptionStatus
from app.api.deps import get_db
from sqlalchemy.orm import Session
from typing import Annotated, Dict, Optional, Any
from pydantic import BaseModel
import stripe
from stripe.error import StripeError
import os
import logging
import uuid
from datetime import datetime, timedelta
from app.api.deps import get_current_user
from app.core.security import create_session_token, verify_session_token, create_access_token, get_password_hash
from starlette.responses import JSONResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Stripe API key and webhook secret
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
stripe.api_version = "2023-10-16"

# Create router
router = APIRouter(tags=["checkout"])

# Define price ID constants
BASIC_TIER_PRICE_ID = os.getenv("STRIPE_BASIC_TIER_PRICE_ID")
PRO_TIER_PRICE_ID = os.getenv("STRIPE_PRO_TIER_PRICE_ID")
ENTERPRISE_TIER_PRICE_ID = os.getenv("STRIPE_ENTERPRISE_TIER_PRICE_ID")
APP_BASE_URL = os.getenv("APP_BASE_URL", "http://localhost:3000")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

class CheckoutSessionRequest(BaseModel):
    tier: str = "basic"
    success_path: str = "/dashboard"
    cancel_path: str = "/pricing"

class TempUserResponse(BaseModel):
    user_id: str
    email: str
    token: str

@router.post("/create-temp-user", response_model=TempUserResponse, tags=["testing"])
async def create_temp_user(db: Annotated[Session, Depends(get_db)]):
    """
    Create a temporary user and return a JWT token for testing purposes.
    """
    try:
        user_id = str(uuid.uuid4())
        email = f"temp_{user_id}@example.com"
        
        user = User(
            id=user_id,
            email=email,
            first_name="Temp",
            last_name="User",
            hashed_password=get_password_hash("temppassword")
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        
        token = create_access_token(subject=user_id, expires_delta=timedelta(hours=1))
        
        logger.info(f"Created temporary user: {email}")
        return {
            "user_id": user_id,
            "email": email,
            "token": token
        }
    
    except Exception as e:
        logger.error(f"Error creating temporary user: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create temporary user: {str(e)}")

@router.delete("/delete-temp-user/{user_id}", tags=["testing"])
async def delete_temp_user(user_id: str, db: Annotated[Session, Depends(get_db)]):
    """
    Delete a temporary user by user_id.
    """
    try:
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        db.delete(user)
        db.commit()
        logger.info(f"Deleted temporary user: {user_id}")
        return {"message": f"Deleted temporary user: {user_id}"}
    
    except Exception as e:
        logger.error(f"Error deleting temporary user: {str(e)}")
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to delete temporary user: {str(e)}")

@router.post("/create-checkout-session", response_class=JSONResponse)
async def create_checkout_session(
    request: Request,
    checkout_data: CheckoutSessionRequest,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[Optional[User], Depends(get_current_user)] = None,
):
    """
    Create a Stripe Checkout Session and return the session URL.
    Includes fallback for testing in development mode.
    """
    if not current_user and ENVIRONMENT == "development":
        logger.warning("No authenticated user; creating temporary user for testing")
        user_id = str(uuid.uuid4())
        email = f"temp_{user_id}@example.com"
        
        current_user = User(
            id=user_id,
            email=email,
            first_name="Temp",
            last_name="User",
            hashed_password=get_password_hash("temppassword")
        )
        db.add(current_user)
        db.commit()
        db.refresh(current_user)
    elif not current_user:
        logger.error("No authenticated user provided")
        raise HTTPException(status_code=401, detail="Authentication required")
    
    logger.info(f"Creating checkout session for user: {current_user.email}, tier: {checkout_data.tier}")
    
    if checkout_data.tier == "pro":
        price_id = PRO_TIER_PRICE_ID
    elif checkout_data.tier == "enterprise":
        price_id = ENTERPRISE_TIER_PRICE_ID
    else:
        price_id = BASIC_TIER_PRICE_ID
    
    if not price_id:
        logger.error(f"Price ID not configured for tier: {checkout_data.tier}")
        raise HTTPException(status_code=500, detail=f"Price ID not configured for tier: {checkout_data.tier}")
    
    try:
        if not current_user.stripe_customer_id:
            customer = stripe.Customer.create(
                email=current_user.email,
                name=f"{current_user.first_name} {current_user.last_name}",
                metadata={"user_id": str(current_user.id)}
            )
            current_user.stripe_customer_id = customer.id
            db.commit()
            logger.info(f"Created new Stripe customer: {customer.id} for user: {current_user.email}")
        else:
            logger.info(f"Using existing Stripe customer: {current_user.stripe_customer_id}")
    
    except StripeError as e:
        logger.error(f"Stripe error creating customer: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to create customer: {str(e)}")
    
    session_token = create_session_token(current_user.id)
    success_url = f"{APP_BASE_URL}{checkout_data.success_path}?session_id={{CHECKOUT_SESSION_ID}}&token={session_token}"
    cancel_url = f"{APP_BASE_URL}{checkout_data.cancel_path}?token={session_token}"
    
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
            metadata={
                "user_id": str(current_user.id),
                "tier": checkout_data.tier
            }
        )
        
        logger.info(f"Created checkout session: {checkout_session.id} for user: {current_user.email}")
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
    Updates subscription_id and completes signup.
    """
    user_id = verify_session_token(token)
    if not user_id:
        logger.warning(f"Invalid session token: {token}")
        return RedirectResponse(url=f"{APP_BASE_URL}/login?error=invalid_session")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        logger.warning(f"User not found for ID: {user_id}")
        return RedirectResponse(url=f"{APP_BASE_URL}/login?error=user_not_found")
    
    try:
        checkout_session = stripe.checkout.Session.retrieve(
            session_id,
            expand=["subscription"]
        )
        
        if checkout_session.client_reference_id != str(user.id):
            logger.warning(f"Session client_reference_id {checkout_session.client_reference_id} doesn't match user ID {user.id}")
            return RedirectResponse(url=f"{APP_BASE_URL}/dashboard?error=session_mismatch")
        
        if checkout_session.status != "complete":
            logger.warning(f"Checkout session {session_id} is not complete. Status: {checkout_session.status}")
            return RedirectResponse(url=f"{APP_BASE_URL}/dashboard?error=session_incomplete")
        
        subscription_id = checkout_session.subscription
        if subscription_id:
            user.subscription_id = subscription_id
            db.commit()
            logger.info(f"Updated user {user.email} with subscription {subscription_id}")
        
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
    """
    user_id = verify_session_token(token)
    if not user_id:
        logger.warning(f"Invalid session token: {token}")
        return RedirectResponse(url=f"{APP_BASE_URL}/login?error=invalid_session")
    
    return RedirectResponse(url=f"{APP_BASE_URL}/pricing?status=canceled")

@router.get("/customer-portal")
async def create_customer_portal(
    request: Request,
    current_user: Annotated[User, Depends(get_current_user)]
):
    """
    Create a Stripe Customer Portal session.
    """
    if not current_user.stripe_customer_id:
        logger.warning(f"No Stripe customer ID for user: {current_user.email}")
        raise HTTPException(status_code=404, detail="No Stripe customer associated with this user")
    
    session_token = create_session_token(current_user.id)
    
    try:
        portal_session = stripe.billing_portal.Session.create(
            customer=current_user.stripe_customer_id,
            return_url=f"{APP_BASE_URL}/dashboard?token={session_token}"
        )
        
        logger.info(f"Created customer portal session for user: {current_user.email}")
        return {"portal_url": portal_session.url}
        
    except StripeError as e:
        logger.error(f"Stripe error creating customer portal: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to create customer portal: {str(e)}")

@router.post("/stripe/webhook")
async def stripe_webhook(request: Request, background_tasks: BackgroundTasks, db: Annotated[Session, Depends(get_db)]):
    """
    Handle Stripe webhook events for subscription updates.
    Completes signup by updating subscription details.
    """
    signature = request.headers.get("stripe-signature")
    if not signature:
        logger.error("Missing Stripe signature in webhook request")
        raise HTTPException(status_code=400, detail="Missing Stripe signature")
    
    payload = await request.body()
    
    try:
        if webhook_secret:
            event = stripe.Webhook.construct_event(
                payload, signature, webhook_secret
            )
        else:
            event = stripe.Event.construct_from(
                await request.json(), stripe.api_key
            )
            logger.warning("Webhook signature verification skipped: No webhook secret configured")
    except (ValueError, stripe.error.SignatureVerificationError) as e:
        logger.error(f"Invalid webhook signature: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid webhook signature: {str(e)}")
    
    event_type = event.get("type")
    logger.info(f"Processing Stripe webhook event: {event_type}")
    
    if event_type.startswith("customer.subscription."):
        subscription_data = event.data.object
        customer_id = subscription_data.get("customer")
        
        log_data = {
            "event_type": event_type,
            "subscription_id": subscription_data.get("id"),
            "customer_id": customer_id,
            "status": subscription_data.get("status"),
            "plan_id": subscription_data.get("plan", {}).get("id"),
        }
        logger.info(f"Subscription event details: {log_data}")
        
        background_tasks.add_task(
            update_user_subscription, 
            db=db, 
            stripe_customer_id=customer_id, 
            subscription_data=subscription_data
        )
    
    elif event_type == "checkout.session.completed":
        session = event.data.object
        
        if session.get("mode") == "subscription":
            customer_id = session.get("customer")
            subscription_id = session.get("subscription")
            
            logger.info(f"Checkout completed: customer={customer_id}, subscription={subscription_id}")
            
            if subscription_id:
                try:
                    subscription = stripe.Subscription.retrieve(
                        subscription_id,
                        expand=["plan.product"]
                    )
                    
                    background_tasks.add_task(
                        update_user_subscription, 
                        db=db, 
                        stripe_customer_id=customer_id, 
                        subscription_data=subscription
                    )
                except StripeError as e:
                    logger.error(f"Error retrieving subscription: {str(e)}")
    
    elif event_type == "customer.deleted":
        customer_data = event.data.object
        customer_id = customer_data.get("id")
        
        try:
            user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
            if user:
                logger.info(f"Customer deleted: {customer_id} for user {user.email}")
                
                user.has_subscription = False
                user.is_trial = False
                user.is_deactivated = True
                user.subscription_id = None
                user.subscription_plan_id = None
                user.subscription_plan_name = None
                user.has_proxy_api_access = False
                
                db.commit()
        except Exception as e:
            logger.error(f"Error processing customer.deleted event: {str(e)}")
            db.rollback()
    
    return {"status": "success", "event_type": event_type}

async def update_user_subscription(db: Session, stripe_customer_id: str, subscription_data: Dict[Any, Any]):
    """
    Update the user subscription status in the database.
    """
    try:
        user = db.query(User).filter(User.stripe_customer_id == stripe_customer_id).first()
        
        if not user:
            logger.warning(f"No user found with Stripe customer ID: {stripe_customer_id}")
            return
        
        logger.info(f"Updating subscription for user: {user.email}")
        
        status = subscription_data.get("status", "")
        
        metadata = {}
        if subscription_data.get("plan") and subscription_data["plan"].get("product"):
            product_id = subscription_data["plan"]["product"]
            try:
                product = stripe.Product.retrieve(product_id)
                if hasattr(product, "metadata"):
                    metadata = product.metadata
            except Exception as e:
                logger.error(f"Error retrieving product metadata: {str(e)}")
        
        user.subscription_id = subscription_data.get("id")
        user.has_subscription = status in ["active", "trialing", "past_due"]
        user.is_trial = status == "trialing"
        user.is_deactivated = status in ["canceled", "unpaid", "incomplete_expired"]
        
        if subscription_data.get("plan"):
            user.subscription_plan_id = subscription_data["plan"].get("id")
            user.subscription_plan_name = subscription_data["plan"].get("nickname")
        
        if subscription_data.get("current_period_start"):
            user.subscription_start = datetime.fromtimestamp(subscription_data["current_period_start"])
        if subscription_data.get("current_period_end"):
            user.subscription_end = datetime.fromtimestamp(subscription_data["current_period_end"])
        
        if metadata.get("proxy-api") == "true":
            user.has_proxy_api_access = True
        else:
            user.has_proxy_api_access = False
            
        db.commit()
        logger.info(f"Successfully updated subscription for user: {user.email}")
        
    except Exception as e:
        logger.error(f"Error updating user subscription: {str(e)}")
        db.rollback()