from fastapi import APIRouter, Depends, HTTPException
from app.models import SubscriptionStatus, User
from typing import Annotated
from app.api.deps import get_current_user
import stripe
from stripe.error import StripeError
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

router = APIRouter(tags=["subscription"])

@router.get("/subscription-status", response_model=SubscriptionStatus)
async def get_subscription_status(current_user: Annotated[User, Depends(get_current_user)]):
    """
    Retrieve the subscription status for the authenticated user from Stripe.
    """
    logger.info(f"Checking subscription for user: {current_user.id}")
    if not current_user.stripe_customer_id:
        logger.warning(f"No Stripe customer ID for user: {current_user.id}")
        return SubscriptionStatus(hasSubscription=False, isTrial=False, isDeactivated=True)
    try:
        subscriptions = stripe.Subscription.list(
            customer=current_user.stripe_customer_id,
            status="all",
            limit=1
        )
        logger.info(f"Retrieved subscriptions for customer: {current_user.stripe_customer_id}")
        
        # Handle case where no subscriptions exist
        if not subscriptions.data:
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
        raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")