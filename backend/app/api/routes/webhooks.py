from fastapi import APIRouter, Depends, HTTPException, Request, BackgroundTasks
from app.models import User, SubscriptionStatus
from app.db.session import get_db
from sqlalchemy.orm import Session
from typing import Annotated, Dict, Any
import stripe
from stripe.error import StripeError
import os
import logging
from datetime import datetime
import hmac
import hashlib

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Stripe API key and webhook secret
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
webhook_secret = os.getenv("STRIPE_WEBHOOK_SECRET")
stripe.api_version = "2023-10-16"  # Use stable version to avoid issues

router = APIRouter(tags=["webhooks"])

# Function to update user subscription status in database
async def update_user_subscription(db: Session, stripe_customer_id: str, subscription_data: Dict[Any, Any]):
    """
    Update the user subscription status in the database based on Stripe webhook data.
    """
    try:
        # Find user by Stripe customer ID
        user = db.query(User).filter(User.stripe_customer_id == stripe_customer_id).first()
        
        if not user:
            logger.warning(f"No user found with Stripe customer ID: {stripe_customer_id}")
            return
        
        logger.info(f"Updating subscription for user: {user.email}")
        
        # Update subscription details based on status
        status = subscription_data.get("status", "")
        
        # Extract subscription metadata if available
        metadata = {}
        if subscription_data.get("plan") and subscription_data["plan"].get("product"):
            product_id = subscription_data["plan"]["product"]
            try:
                product = stripe.Product.retrieve(product_id)
                if hasattr(product, "metadata"):
                    metadata = product.metadata
            except Exception as e:
                logger.error(f"Error retrieving product metadata: {str(e)}")
        
        # Store the subscription ID in the user record
        user.subscription_id = subscription_data.get("id")
        
        # Update subscription status flags based on the SubscriptionStatus model
        user.has_subscription = status in ["active", "trialing", "past_due"]
        user.is_trial = status == "trialing"
        user.is_deactivated = status in ["canceled", "unpaid", "incomplete_expired"]
        
        # Store subscription plan details
        if subscription_data.get("plan"):
            user.subscription_plan_id = subscription_data["plan"].get("id")
            user.subscription_plan_name = subscription_data["plan"].get("nickname")
        
        # Store subscription dates
        if subscription_data.get("current_period_start"):
            user.subscription_start = datetime.fromtimestamp(subscription_data["current_period_start"])
        if subscription_data.get("current_period_end"):
            user.subscription_end = datetime.fromtimestamp(subscription_data["current_period_end"])
        
        # Check for proxy-api access in metadata
        if metadata.get("proxy-api") == "true":
            user.has_proxy_api_access = True
        else:
            user.has_proxy_api_access = False
            
        # Save changes to database
        db.commit()
        logger.info(f"Successfully updated subscription for user: {user.email}")
        
    except Exception as e:
        logger.error(f"Error updating user subscription: {str(e)}")
        db.rollback()

@router.post("/stripe/webhook")
async def stripe_webhook(request: Request, background_tasks: BackgroundTasks, db: Annotated[Session, Depends(get_db)]):
    """
    Handle Stripe webhook events for subscription updates.
    """
    # Get the webhook signature from the request header
    signature = request.headers.get("stripe-signature")
    if not signature:
        logger.error("Missing Stripe signature in webhook request")
        raise HTTPException(status_code=400, detail="Missing Stripe signature")
    
    # Get the raw request body
    payload = await request.body()
    
    # Verify the webhook signature
    try:
        if webhook_secret:
            event = stripe.Webhook.construct_event(
                payload, signature, webhook_secret
            )
        else:
            # For development without webhook signature verification
            event = stripe.Event.construct_from(
                await request.json(), stripe.api_key
            )
            logger.warning("Webhook signature verification skipped: No webhook secret configured")
    except (ValueError, stripe.error.SignatureVerificationError) as e:
        logger.error(f"Invalid webhook signature: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Invalid webhook signature: {str(e)}")
    
    # Process the event
    event_type = event.get("type")
    logger.info(f"Processing Stripe webhook event: {event_type}")
    
    # Handle subscription-related events
    if event_type.startswith("customer.subscription."):
        subscription_data = event.data.object
        customer_id = subscription_data.get("customer")
        
        # Log important subscription details
        log_data = {
            "event_type": event_type,
            "subscription_id": subscription_data.get("id"),
            "customer_id": customer_id,
            "status": subscription_data.get("status"),
            "plan_id": subscription_data.get("plan", {}).get("id"),
        }
        logger.info(f"Subscription event details: {log_data}")
        
        # Process subscription events asynchronously
        background_tasks.add_task(
            update_user_subscription, 
            db=db, 
            stripe_customer_id=customer_id, 
            subscription_data=subscription_data
        )
    
    # Handle checkout session completion
    elif event_type == "checkout.session.completed":
        session = event.data.object
        
        # Make sure this is a subscription checkout
        if session.get("mode") == "subscription":
            customer_id = session.get("customer")
            subscription_id = session.get("subscription")
            
            # Log session details
            logger.info(f"Checkout completed: customer={customer_id}, subscription={subscription_id}")
            
            if subscription_id:
                try:
                    # Retrieve full subscription details
                    subscription = stripe.Subscription.retrieve(
                        subscription_id,
                        expand=["plan.product"]
                    )
                    
                    # Process subscription asynchronously
                    background_tasks.add_task(
                        update_user_subscription, 
                        db=db, 
                        stripe_customer_id=customer_id, 
                        subscription_data=subscription
                    )
                except StripeError as e:
                    logger.error(f"Error retrieving subscription: {str(e)}")
    
    # Handle customer deletion events
    elif event_type == "customer.deleted":
        customer_data = event.data.object
        customer_id = customer_data.get("id")
        
        try:
            # Find and update user record
            user = db.query(User).filter(User.stripe_customer_id == customer_id).first()
            if user:
                logger.info(f"Customer deleted: {customer_id} for user {user.email}")
                
                # Clear subscription details
                user.has_subscription = False
                user.is_trial = False
                user.is_deactivated = True
                user.subscription_id = None
                user.subscription_plan_id = None
                user.subscription_plan_name = None
                user.has_proxy_api_access = False
                
                # Save changes
                db.commit()
        except Exception as e:
            logger.error(f"Error processing customer.deleted event: {str(e)}")
            db.rollback()
    
    # Return a 200 response to acknowledge receipt of the event
    return {"status": "success", "event_type": event_type}
