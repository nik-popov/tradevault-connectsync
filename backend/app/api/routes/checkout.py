from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from fastapi.responses import RedirectResponse, JSONResponse
from app.models import User, SubscriptionStatus
from app.api.deps import get_db
from sqlalchemy.orm import Session
from typing import Dict, Optional, Any
from pydantic import BaseModel, EmailStr, Field
import stripe
from stripe.error import StripeError, InvalidRequestError
import os
import logging
import uuid
import secrets
import smtplib
from email.mime.text import MIMEText
from datetime import datetime, timedelta
from app.core.security import create_session_token, verify_session_token, create_access_token, get_password_hash
from starlette.responses import JSONResponse

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Stripe API key and webhook secret
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
stripe.api_version = "2023-10-16"

# Email configuration
EMAIL_SENDER = os.getenv("EMAIL_SENDER", "no-reply@thedataproxy.com")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")
EMAIL_SERVER = os.getenv("EMAIL_SERVER", "smtp.gmail.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", 587))
ACTIVATION_URL = os.getenv("ACTIVATION_URL", "https://api.thedataproxy.com/activate")

# Create router
router = APIRouter(tags=["checkout"])

# Define price ID constants for monthly and yearly plans
PRICE_IDS = {
    "basic": {
        "monthly": os.getenv("STRIPE_BASIC_TIER_MONTHLY_PRICE_ID"),
        "yearly": os.getenv("STRIPE_BASIC_TIER_YEARLY_PRICE_ID")
    },
    "pro": {
        "monthly": os.getenv("STRIPE_PRO_TIER_MONTHLY_PRICE_ID"),
        "yearly": os.getenv("STRIPE_PRO_TIER_YEARLY_PRICE_ID")
    },
    "enterprise": {
        "monthly": os.getenv("STRIPE_ENTERPRISE_TIER_MONTHLY_PRICE_ID"),
        "yearly": os.getenv("STRIPE_ENTERPRISE_TIER_YEARLY_PRICE_ID")
    }
}
APP_BASE_URL = os.getenv("APP_BASE_URL", "http://localhost:3000")

class CheckoutSessionRequest(BaseModel):
    tier: str = "basic"
    billing_interval: str = "monthly"
    success_path: str = "/dashboard"
    cancel_path: str = "/pricing"
    email: EmailStr

async def send_activation_email(email: str, activation_token: str):
    """
    Send an activation email with a link to set a permanent password.
    """
    try:
        msg = MIMEText(
            f"Please activate your account by clicking this link: "
            f"{ACTIVATION_URL}?token={activation_token}"
        )
        msg["Subject"] = "Activate Your Data Proxy Account"
        msg["From"] = EMAIL_SENDER
        msg["To"] = email

        with smtplib.SMTP(EMAIL_SERVER, EMAIL_PORT) as server:
            server.starttls()
            server.login(EMAIL_SENDER, EMAIL_PASSWORD)
            server.send_message(msg)
        logger.info(f"Activation email sent to: {email}")
    except Exception as e:
        logger.error(f"Failed to send activation email to {email}: {str(e)}")
        raise

@router.post("/create-checkout-session", response_class=JSONResponse)
async def create_checkout_session(
    request: Request,
    checkout_data: CheckoutSessionRequest,
    db: Annotated[Session, Depends(get_db)]
):
    """
    Create a Stripe Checkout Session and return the session URL.
    Supports monthly and yearly billing intervals.
    """
    logger.info(f"Creating checkout session for email: {checkout_data.email}, tier: {checkout_data.tier}, billing_interval: {checkout_data.billing_interval}")
    
    price_id = PRICE_IDS.get(checkout_data.tier, {}).get(checkout_data.billing_interval)
    
    if not price_id:
        logger.error(f"Price ID not configured for tier: {checkout_data.tier}, billing_interval: {checkout_data.billing_interval}")
        raise HTTPException(status_code=500, detail=f"Price ID not configured for tier: {checkout_data.tier}, billing_interval: {checkout_data.billing_interval}")
    
    # Create a Stripe customer
    try:
        customer = stripe.Customer.create(
            email=checkout_data.email,
            metadata={"temp_user": "true"}
        )
        logger.info(f"Created new Stripe customer: {customer.id} for email: {checkout_data.email}")
    except StripeError as e:
        logger.error(f"Stripe error creating customer: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to create customer: {str(e)}")
    
    # Generate a temporary session token (for redirect purposes)
    session_token = create_session_token(str(uuid.uuid4()))
    success_url = f"{APP_BASE_URL}{checkout_data.success_path}?session_id={{CHECKOUT_SESSION_ID}}&token={session_token}"
    cancel_url = f"{APP_BASE_URL}{checkout_data.cancel_path}?token={session_token}"
    
    try:
        checkout_session = stripe.checkout.Session.create(
            customer=customer.id,
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
            client_reference_id=str(uuid.uuid4()),  # Temporary ID until user is created
            metadata={
                "email": checkout_data.email,
                "tier": checkout_data.tier,
                "billing_interval": checkout_data.billing_interval
            }
        )
        
        logger.info(f"Created checkout session: {checkout_session.id} for email: {checkout_data.email}")
        return {
            "checkout_url": checkout_session.url,
            "session_id": checkout_session.id
        }
        
    except StripeError as e:
        logger.error(f"Stripe error creating checkout session: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to create checkout session: {str(e)}")

@router.post("/stripe/webhook")
async def stripe_webhook(request: Request, background_tasks: BackgroundTasks, db: Annotated[Session, Depends(get_db)]):
    """
    Handle Stripe webhook events for subscription updates.
    Creates user account and sends activation email on checkout.session.completed.
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
    
    if event_type == "checkout.session.completed":
        session = event.data.object
        
        if session.get("mode") == "subscription":
            customer_id = session.get("customer")
            subscription_id = session.get("subscription")
            email = session.metadata.get("email")
            tier = session.metadata.get("tier")
            billing_interval = session.metadata.get("billing_interval")
            
            logger.info(f"Checkout completed: customer={customer_id}, subscription={subscription_id}, email={email}")
            
            if subscription_id and email:
                try:
                    subscription = stripe.Subscription.retrieve(
                        subscription_id,
                        expand=["plan.product"]
                    )
                    
                    # Check if user already exists
                    user = db.query(User).filter(User.email == email).first()
                    if user:
                        logger.info(f"User already exists: {email}")
                    else:
                        # Create new user
                        user_id = str(uuid.uuid4())
                        temporary_password = secrets.token_urlsafe(12)
                        user = User(
                            id=user_id,
                            email=email,
                            full_name="New User",
                            hashed_password=get_password_hash(temporary_password),
                            is_active=False,  # Require activation
                            stripe_customer_id=customer_id,
                            subscription_id=subscription_id
                        )
                        db.add(user)
                        db.commit()
                        db.refresh(user)
                        logger.info(f"Created new user: {email}")
                        
                        # Generate activation token
                        activation_token = create_access_token(subject=user_id, expires_delta=timedelta(hours=24))
                        
                        # Send activation email
                        background_tasks.add_task(send_activation_email, email, activation_token)
                    
                    # Update subscription details
                    background_tasks.add_task(
                        update_user_subscription, 
                        db=db, 
                        stripe_customer_id=customer_id, 
                        subscription_data=subscription
                    )
                except StripeError as e:
                    logger.error(f"Error retrieving subscription: {str(e)}")
    
    elif event_type.startswith("customer.subscription."):
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