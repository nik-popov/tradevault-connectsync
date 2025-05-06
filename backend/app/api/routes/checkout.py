from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from fastapi.responses import JSONResponse
from app.models import User, SubscriptionStatus
from app.api.deps import get_db
from sqlalchemy.orm import Session
from typing import Annotated, Dict, Optional, Any
from pydantic import BaseModel, EmailStr, Field
import stripe
from stripe.error import StripeError
import os
import logging
import uuid
import secrets
from datetime import datetime, timedelta
from app.core.security import create_access_token, get_password_hash, verify_access_token, create_session_token
from app.api.deps import get_current_user
from app.core.config import settings
from starlette.responses import JSONResponse
import emails

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Stripe API key and webhook secret
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
stripe.api_version = "2023-10-16"

# Create router
router = APIRouter(tags=["webhook", "auth"])

class ActivateRequest(BaseModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)

class EmailData:
    def __init__(self, html_content: str, subject: str):
        self.html_content = html_content
        self.subject = subject

def send_email(
    *,
    email_to: str,
    subject: str = "",
    html_content: str = "",
) -> bool:
    try:
        if not settings.emails_enabled:
            logger.warning("Email sending is disabled in settings")
            return False
            
        message = emails.Message(
            subject=subject,
            html=html_content,
            mail_from=(settings.EMAILS_FROM_NAME, settings.EMAILS_FROM_EMAIL),
        )
        
        smtp_options = {"host": settings.SMTP_HOST, "port": settings.SMTP_PORT}
        if settings.SMTP_TLS:
            smtp_options["tls"] = True
        elif settings.SMTP_SSL:
            smtp_options["ssl"] = True
        if settings.SMTP_USER:
            smtp_options["user"] = settings.SMTP_USER
        if settings.SMTP_PASSWORD:
            smtp_options["password"] = settings.SMTP_PASSWORD
            
        response = message.send(to=email_to, smtp=smtp_options)
        
        logger.info(f"Email response: status_code={response.status_code}, "
                   f"status_text={response.status_text}, "
                   f"error={getattr(response, 'error', 'None')}")
        
        if response.status_code and 200 <= response.status_code < 300:
            return True
        else:
            logger.error(f"Failed to send email: Status code {response.status_code}")
            return False
            
    except Exception as e:
        logger.error(f"Exception sending email: {str(e)}")
        return False

def generate_activation_email(email_to: str, token: str) -> EmailData:
    project_name = settings.PROJECT_NAME
    subject = f"{project_name} - Activate Your Account"
    link = f"https://thedataproxy.com/activate?token={token}"
    html_content = f"""
    <html>
        <body>
            <h1>{project_name}</h1>
            <p>Please activate your account by clicking the link below:</p>
            <a href="{link}">{link}</a>
            <p>This link is valid for {settings.EMAIL_RESET_TOKEN_EXPIRE_HOURS} hours.</p>
        </body>
    </html>
    """
    return EmailData(html_content=html_content, subject=subject)

async def create_user_if_not_exists(
    db: Session,
    email: str,
    customer_id: Optional[str] = None,
    subscription_id: Optional[str] = None,
    background_tasks: BackgroundTasks = None
):
    """
    Create a user account if none exists for the given email, and send an activation email.
    """
    user = db.query(User).filter(User.email == email).first()
    if user:
        logger.info(f"User already exists: {email}")
        return user
    
    user_id = str(uuid.uuid4())
    temporary_password = secrets.token_urlsafe(12)
    user = User(
        id=user_id,
        email=email,
        full_name="New User",
        hashed_password=get_password_hash(temporary_password),
        is_active=False,
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
    if background_tasks:
        email_data = generate_activation_email(email_to=email, token=activation_token)
        background_tasks.add_task(
            send_email,
            email_to=email,
            subject=email_data.subject,
            html_content=email_data.html_content
        )
    
    return user

@router.post("/activate")
async def activate_account(request: ActivateRequest, db: Annotated[Session, Depends(get_db)]):
    """
    Activate a user account by setting a permanent password using an activation token.
    """
    user_id = verify_access_token(request.token)
    if not user_id:
        logger.error("Invalid or expired activation token")
        raise HTTPException(status_code=400, detail="Invalid or expired activation token")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        logger.error(f"User not found for ID: {user_id}")
        raise HTTPException(status_code=404, detail="User not found")
    
    user.hashed_password = get_password_hash(request.new_password)
    user.is_active = True
    db.commit()
    logger.info(f"Account activated successfully for user: {user.email}")
    return {"message": "Account activated successfully"}

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
            return_url=f"{settings.APP_BASE_URL}/dashboard?token={session_token}"
        )
        
        logger.info(f"Created customer portal session for user: {current_user.email}")
        return {"portal_url": portal_session.url}
        
    except StripeError as e:
        logger.error(f"Stripe error creating customer portal: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to create customer portal: {str(e)}")

@router.post("/stripe/webhook")
async def stripe_webhook(request: Request, background_tasks: BackgroundTasks, db: Annotated[Session, Depends(get_db)]):
    """
    Handle Stripe webhook events for subscriptions, one-time purchases, and product-related events.
    Creates user account and sends activation email for relevant billing events.
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
        customer_id = session.get("customer")
        subscription_id = session.get("subscription")
        email = session.metadata.get("email") or session.get("customer_details", {}).get("email")
        
        logger.info(f"Checkout completed: customer={customer_id}, subscription={subscription_id}, email={email}")
        
        if email:
            try:
                user = await create_user_if_not_exists(
                    db=db,
                    email=email,
                    customer_id=customer_id,
                    subscription_id=subscription_id,
                    background_tasks=background_tasks
                )
                
                if subscription_id:
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
                logger.error(f"Error processing checkout.session.completed: {str(e)}")
    
    elif event_type == "charge.succeeded":
        charge = event.data.object
        customer_id = charge.get("customer")
        email = charge.get("billing_details", {}).get("email")
        charge_id = charge.get("id")
        amount = charge.get("amount") / 100.0  # Convert cents to dollars
        currency = charge.get("currency")
        
        logger.info(f"Charge succeeded: customer={customer_id}, charge={charge_id}, email={email}, amount={amount} {currency}")
        
        if email:
            try:
                user = await create_user_if_not_exists(
                    db=db,
                    email=email,
                    customer_id=customer_id,
                    background_tasks=background_tasks
                )
            except Exception as e:
                logger.error(f"Error processing charge.succeeded: {str(e)}")
    
    elif event_type in ["product.created", "product.updated", "price.created"]:
        data = event.data.object
        product_id = data.get("id")
        logger.info(f"Processing {event_type}: product/price={product_id}")
        
        try:
            subscriptions = stripe.Subscription.list(
                limit=10,
                expand=["data.customer"]
            )
            for sub in subscriptions.data:
                if sub.plan.product == product_id:
                    email = sub.customer.email
                    customer_id = sub.customer.id
                    subscription_id = sub.id
                    if email:
                        user = await create_user_if_not_exists(
                            db=db,
                            email=email,
                            customer_id=customer_id,
                            subscription_id=subscription_id,
                            background_tasks=background_tasks
                        )
                        background_tasks.add_task(
                            update_user_subscription,
                            db=db,
                            stripe_customer_id=customer_id,
                            subscription_data=sub
                        )
                        break
        except StripeError as e:
            logger.error(f"Error retrieving subscriptions for product: {str(e)}")
    
    elif event_type.startswith("customer.subscription."):
        subscription_data = event.data.object
        customer_id = subscription_data.get("customer")
        email = None
        try:
            customer = stripe.Customer.retrieve(customer_id)
            email = customer.get("email")
        except StripeError as e:
            logger.error(f"Error retrieving customer: {str(e)}")
        
        log_data = {
            "event_type": event_type,
            "subscription_id": subscription_data.get("id"),
            "customer_id": customer_id,
            "status": subscription_data.get("status"),
            "plan_id": subscription_data.get("plan", {}).get("id"),
        }
        logger.info(f"Subscription event details: {log_data}")
        
        if email:
            user = await create_user_if_not_exists(
                db=db,
                email=email,
                customer_id=customer_id,
                subscription_id=subscription_data.get("id"),
                background_tasks=background_tasks
            )
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
                logger.info(f"Customer deleted: {customer_id} for user: {user.email}")
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
            product_id = subscription_data["plan"].get("product")
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