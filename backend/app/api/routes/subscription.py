from fastapi import APIRouter, Depends, HTTPException
from app.models import SubscriptionStatus, User
from typing import Annotated
from app.api.deps import get_current_user
import stripe
from stripe.error import StripeError
from dotenv import load_dotenv
import os
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

router = APIRouter(tags=["subscription"])

@router.get("/subscription-status", response_model=SubscriptionStatus)
async def get_subscription_status(current_user: Annotated[User, Depends(get_current_user)]):
    """
    Retrieve the subscription status for the authenticated user from Stripe.
    """
    logger.info(f"Fetching subscription status for user: {current_user.email}")
    
    # Validate Stripe API key
    if not stripe.api_key:
        logger.error("Stripe API key is not configured")
        raise HTTPException(status_code=500, detail="Server configuration error: Missing Stripe API key")

    # Check if the user has a Stripe customer ID
    if not current_user.stripe_customer_id:
        logger.warning(f"No Stripe customer ID for user: {current_user.email}")
        return SubscriptionStatus(
            hasSubscription=False,
            isTrial=False,
            isDeactivated=True
        )

    try:
        # Fetch the customer's subscriptions from Stripe
        subscriptions = stripe.Subscription.list(
            customer=current_user.stripe_customer_id,
            status="all",
            limit=1
        )
        logger.info(f"Retrieved subscriptions for customer: {current_user.stripe_customer_id}")

        # Handle case where no subscriptions exist
        if not subscriptions.data:
            logger.info(f"No subscriptions found for customer: {current_user.stripe_customer_id}")
            return SubscriptionStatus(
                hasSubscription=False,
                isTrial=False,
                isDeactivated=True
            )

        # Get the first subscription
        subscription = subscriptions.data[0]

        # Map Stripe subscription status to your model
        has_subscription = subscription.status in ["active", "trialing", "past_due"]
        is_trial = subscription.status == "trialing"
        is_deactivated = subscription.status in ["canceled", "unpaid", "incomplete_expired"]

        return SubscriptionStatus(
            hasSubscription=has_subscription,
            isTrial=is_trial,
            isDeactivated=is_deactivated
        )

    except StripeError as e:
        logger.error(f"Stripe error for user {current_user.email}: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to fetch subscription: {str(e)}")
    except Exception as e:
        logger.error(f"Internal server error for user {current_user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")