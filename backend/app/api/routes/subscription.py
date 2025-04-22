from fastapi import APIRouter, Depends, HTTPException
from app.models import SubscriptionStatus, User
from typing import Annotated, List
from pydantic import BaseModel
import stripe
from stripe.error import StripeError
import os
import logging
from datetime import datetime
from app.api.deps import get_current_user

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Stripe API key
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
stripe.api_version = "2025-03-31.basil"  # Ensure consistent API version

router = APIRouter(tags=["subscription"])

# Pydantic model for customer response
class CustomerResponse(BaseModel):
    id: str
    email: str | None
    name: str | None
    created: int
    description: str | None

# Pydantic model for subscription response
class SubscriptionResponse(BaseModel):
    id: str
    status: str
    plan_id: str | None
    plan_name: str | None
    product_id: str | None
    product_name: str | None
    current_period_start: int | None  # Made optional
    current_period_end: int | None    # Made optional
    trial_start: int | None
    trial_end: int | None
    cancel_at_period_end: bool
    metadata: dict | None  # Added for potential tier-specific flags (e.g., serp_enabled)

@router.get("/customer", response_model=CustomerResponse)
async def get_customer(current_user: Annotated[User, Depends(get_current_user)]):
    """
    Fetch the Stripe customer details for the authenticated user.
    """
    logger.info(f"Fetching customer for user: {current_user.email}")

    if not stripe.api_key:
        logger.error("Stripe API key is not configured")
        raise HTTPException(status_code=500, detail="Server configuration error: Missing Stripe API key")

    if not current_user.stripe_customer_id:
        logger.warning(f"No Stripe customer ID for user: {current_user.email}")
        raise HTTPException(status_code=404, detail="No Stripe customer associated with this user")

    try:
        customer = stripe.Customer.retrieve(current_user.stripe_customer_id)
        logger.info(f"Retrieved customer: {current_user.stripe_customer_id}")

        return CustomerResponse(
            id=customer.id,
            email=customer.email,
            name=customer.name,
            created=customer.created,
            description=customer.description
        )

    except StripeError as e:
        logger.error(f"Stripe error for user {current_user.email}: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to fetch customer: {str(e)}")
    except Exception as e:
        logger.error(f"Internal server error for user {current_user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/customer/subscriptions", response_model=List[SubscriptionResponse])
async def get_customer_subscriptions(current_user: Annotated[User, Depends(get_current_user)]):
    """
    Fetch all subscriptions for the authenticated user's Stripe customer, including tier details.
    """
    logger.info(f"Fetching subscriptions for user: {current_user.email}")

    if not stripe.api_key:
        logger.error("Stripe API key is not configured")
        raise HTTPException(status_code=500, detail="Server configuration error: Missing Stripe API key")

    if not current_user.stripe_customer_id:
        logger.warning(f"No Stripe customer ID for user: {current_user.email}")
        raise HTTPException(status_code=404, detail="No Stripe customer associated with this user")

    try:
        subscriptions = stripe.Subscription.list(
            customer=current_user.stripe_customer_id,
            status="all",
            expand=["data.plan.product"]
        )
        logger.info(f"Retrieved {len(subscriptions.data)} subscriptions for customer: {current_user.stripe_customer_id}")

        subscription_list = []
        for sub in subscriptions.data:
            # Skip subscriptions with missing current_period_start
            if not hasattr(sub, "current_period_start") or sub.current_period_start is None:
                logger.warning(f"Skipping subscription {sub.id} with missing current_period_start (status: {sub.status})")
                continue

            plan_id = sub.plan.id if sub.plan else None
            plan_name = sub.plan.nickname if sub.plan and sub.plan.nickname else None
            product_id = sub.plan.product.id if sub.plan and sub.plan.product else None
            product_name = (
                sub.plan.product.name
                if sub.plan and sub.plan.product and hasattr(sub.plan.product, "name")
                else None
            )
            metadata = (
                sub.plan.product.metadata
                if sub.plan and sub.plan.product and hasattr(sub.plan.product, "metadata")
                else None
            )

            subscription_list.append(
                SubscriptionResponse(
                    id=sub.id,
                    status=sub.status,
                    plan_id=plan_id,
                    plan_name=plan_name,
                    product_id=product_id,
                    product_name=product_name,
                    current_period_start=sub.current_period_start,
                    current_period_end=sub.current_period_end if hasattr(sub, "current_period_end") else None,
                    trial_start=sub.trial_start,
                    trial_end=sub.trial_end,
                    cancel_at_period_end=sub.cancel_at_period_end,
                    metadata=metadata
                )
            )

        return subscription_list

    except StripeError as e:
        logger.error(f"Stripe error for user {current_user.email}: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to fetch subscriptions: {str(e)}")
    except Exception as e:
        logger.error(f"Internal server error for user {current_user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/subscription-status", response_model=SubscriptionStatus)
async def get_subscription_status(current_user: Annotated[User, Depends(get_current_user)]):
    """
    Retrieve the subscription status for the authenticated user from Stripe.
    """
    logger.info(f"Fetching subscription status for user: {current_user.email}")

    if not stripe.api_key:
        logger.error("Stripe API key is not configured")
        raise HTTPException(status_code=500, detail="Server configuration error: Missing Stripe API key")

    if not current_user.stripe_customer_id:
        logger.warning(f"No Stripe customer ID for user: {current_user.email}")
        return SubscriptionStatus(
            hasSubscription=False,
            isTrial=False,
            isDeactivated=True
        )

    try:
        subscriptions = stripe.Subscription.list(
            customer=current_user.stripe_customer_id,
            status="all",
            limit=1
        )
        logger.info(f"Retrieved subscriptions for customer: {current_user.stripe_customer_id}")

        if not subscriptions.data:
            logger.info(f"No subscriptions found for customer: {current_user.stripe_customer_id}")
            return SubscriptionStatus(
                hasSubscription=False,
                isTrial=False,
                isDeactivated=True
            )

        subscription = subscriptions.data[0]
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
        raise HTTPException(status_code=400, detail=f"Failed to fetch subscription status: {str(e)}")
    except Exception as e:
        logger.error(f"Internal server error for user {current_user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")