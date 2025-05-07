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
from sqlmodel import Session, select
from app.database import get_session
import re
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load Stripe API key
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
stripe.api_version = os.getenv("STRIPE_API_VERSION", "2023-10-16")

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
    current_period_start: int | None
    current_period_end: int | None
    trial_start: int | None
    trial_end: int | None
    cancel_at_period_end: bool
    metadata: dict | None

# Pydantic model for proxy API access response
class ProxyApiAccessResponse(BaseModel):
    has_access: bool
    message: str | None

def validate_stripe_customer_id(customer_id: str) -> bool:
    """Validate Stripe customer ID format (e.g., cus_XXX)."""
    if not customer_id or not re.match(r"^cus_[A-Za-z0-9]+$", customer_id):
        return False
    return True

@router.get("/customer", response_model=CustomerResponse)
async def get_customer(current_user: Annotated[User, Depends(get_current_user)]):
    """
    Fetch the Stripe customer details for the authenticated user.
    """
    logger.info(f"Fetching customer for user: {current_user.email}")

    if not stripe.api_key:
        logger.error("Stripe API key is not configured")
        raise HTTPException(status_code=500, detail="Server configuration error: Missing Stripe API key")

    if not current_user.stripe_customer_id or not validate_stripe_customer_id(current_user.stripe_customer_id):
        logger.warning(f"Invalid or missing Stripe customer ID for user: {current_user.email}")
        raise HTTPException(status_code=404, detail="No valid Stripe customer associated with this user")

    try:
        @retry(
            stop=stop_after_attempt(3),
            wait=wait_exponential(multiplier=1, min=1, max=10),
            retry=retry_if_exception_type(StripeError),
            reraise=True
        )
        def retrieve_customer():
            return stripe.Customer.retrieve(current_user.stripe_customer_id)

        customer = retrieve_customer()
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
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/customer/subscriptions", response_model=List[SubscriptionResponse])
async def get_customer_subscriptions(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_session)
):
    """
    Fetch all subscriptions for the authenticated user's Stripe customer, including tier details.
    Validate against database has_subscription field.
    """
    logger.info(f"Fetching subscriptions for user: {current_user.email}")

    if not stripe.api_key:
        logger.error("Stripe API key is not configured")
        raise HTTPException(status_code=500, detail="Server configuration error: Missing Stripe API key")

    if not current_user.stripe_customer_id or not validate_stripe_customer_id(current_user.stripe_customer_id):
        logger.warning(f"Invalid or missing Stripe customer ID for user: {current_user.email}")
        raise HTTPException(status_code=404, detail="No valid Stripe customer associated with this user")

    subscription_list = []

    try:
        @retry(
            stop=stop_after_attempt(3),
            wait=wait_exponential(multiplier=1, min=1, max=10),
            retry=retry_if_exception_type(StripeError),
            reraise=True
        )
        def list_subscriptions():
            return stripe.Subscription.list(
                customer=current_user.stripe_customer_id,
                status="all",
                expand=["data.plan.product"]
            )

        subscriptions = list_subscriptions()
        logger.info(f"Stripe returned {len(subscriptions.data)} subscriptions for customer: {current_user.stripe_customer_id}")

        for sub in subscriptions.data:
            log_details = {
                "subscription_id": sub.id,
                "status": sub.status,
                "current_period_start": getattr(sub, "current_period_start", None),
                "current_period_end": getattr(sub, "current_period_end", None),
                "plan_id": sub.plan.id if sub.plan else None,
                "plan_name": sub.plan.nickname if sub.plan and sub.plan.nickname else None,
                "product_id": sub.plan.product.id if sub.plan and sub.plan.product else None,
                "product_name": (
                    sub.plan.product.name
                    if sub.plan and sub.plan.product and hasattr(sub.plan.product, "name")
                    else None
                ),
                "metadata": (
                    sub.plan.product.metadata
                    if sub.plan and sub.plan.product and hasattr(sub.plan.product, "metadata")
                    else None
                ),
                "trial_start": sub.trial_start,
                "trial_end": sub.trial_end,
                "cancel_at_period_end": sub.cancel_at_period_end
            }
            logger.info(f"Subscription details: {log_details}")

            if sub.status not in ["active", "trialing", "past_due"]:
                logger.warning(f"Skipping subscription {sub.id} with status {sub.status}")
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
                    current_period_start=sub.current_period_start if hasattr(sub, "current_period_start") else None,
                    current_period_end=sub.current_period_end if hasattr(sub, "current_period_end") else None,
                    trial_start=sub.trial_start,
                    trial_end=sub.trial_end,
                    cancel_at_period_end=sub.cancel_at_period_end,
                    metadata=metadata
                )
            )

        # Validate against database
        if not subscription_list and current_user.has_subscription:
            logger.error(
                f"Stripe returned no subscriptions for user {current_user.email} (customer: {current_user.stripe_customer_id}), "
                f"but has_subscription = 1 in database. Possible Stripe sync issue."
            )
            raise HTTPException(
                status_code=500,
                detail="Internal server error: Subscription data mismatch. Contact support."
            )

        if subscription_list and not current_user.has_subscription:
            logger.warning(
                f"Stripe returned subscriptions for user {current_user.email}, but has_subscription = 0 in database. "
                f"Updating database to reflect Stripe state."
            )
            current_user.has_subscription = 1
            db.add(current_user)
            db.commit()

        return subscription_list

    except StripeError as e:
        logger.error(f"Stripe error for user {current_user.email}: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Failed to fetch subscriptions: {str(e)}")
    except Exception as e:
        logger.error(f"Internal server error for user {current_user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")

@router.get("/subscription-status", response_model=SubscriptionStatus)
async def get_subscription_status(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_session)
):
    """
    Retrieve the subscription status for the authenticated user, prioritizing database state.
    """
    logger.info(f"Fetching subscription status for user: {current_user.email}")

    if not stripe.api_key:
        logger.error("Stripe API key is not configured")
        raise HTTPException(status_code=500, detail="Server configuration error: Missing Stripe API key")

    # Prioritize database state
    if current_user.has_subscription:
        logger.info(f"Database indicates has_subscription = 1 for user: {current_user.email}")
        # Verify with Stripe to determine trial or deactivation status
        if not current_user.stripe_customer_id or not validate_stripe_customer_id(current_user.stripe_customer_id):
            logger.warning(f"Invalid or missing Stripe customer ID for user: {current_user.email}")
            return SubscriptionStatus(
                hasSubscription=True,
                isTrial=False,
                isDeactivated=False
            )

        try:
            @retry(
                stop=stop_after_attempt(3),
                wait=wait_exponential(multiplier=1, min=1, max=10),
                retry=retry_if_exception_type(StripeError),
                reraise=True
            )
            def list_subscriptions():
                return stripe.Subscription.list(
                    customer=current_user.stripe_customer_id,
                    status="all",
                    limit=1
                )

            subscriptions = list_subscriptions()
            logger.info(f"Stripe returned {len(subscriptions.data)} subscriptions for customer: {current_user.stripe_customer_id}")

            if not subscriptions.data:
                logger.error(
                    f"No subscriptions found in Stripe for user {current_user.email} (customer: {current_user.stripe_customer_id}), "
                    f"but has_subscription = 1 in database. Possible Stripe sync issue."
                )
                return SubscriptionStatus(
                    hasSubscription=True,
                    isTrial=False,
                    isDeactivated=False
                )

            subscription = subscriptions.data[0]
            has_subscription = subscription.status in ["active", "trialing", "past_due"]
            is_trial = subscription.status == "trialing"
            is_deactivated = subscription.status in ["canceled", "unpaid", "incomplete_expired"]

            # Ensure database consistency
            if not has_subscription and current_user.has_subscription:
                logger.warning(
                    f"Stripe indicates no active subscription for user {current_user.email}, "
                    f"but has_subscription = 1 in database. Keeping database state."
                )
            elif has_subscription and not current_user.has_subscription:
                logger.warning(
                    f"Stripe indicates active subscription for user {current_user.email}, "
                    f"but has_subscription = 0 in database. Updating database."
                )
                current_user.has_subscription = 1
                db.add(current_user)
                db.commit()

            return SubscriptionStatus(
                hasSubscription=has_subscription or current_user.has_subscription,
                isTrial=is_trial,
                isDeactivated=is_deactivated
            )

        except StripeError as e:
            logger.error(f"Stripe error for user {current_user.email}: {str(e)}")
            # Fallback to database state on Stripe error
            return SubscriptionStatus(
                hasSubscription=True,
                isTrial=False,
                isDeactivated=False
            )
    else:
        # No subscription in database, check Stripe
        if not current_user.stripe_customer_id or not validate_stripe_customer_id(current_user.stripe_customer_id):
            logger.warning(f"Invalid or missing Stripe customer ID for user: {current_user.email}")
            return SubscriptionStatus(
                hasSubscription=False,
                isTrial=False,
                isDeactivated=True
            )

        try:
            @retry(
                stop=stop_after_attempt(3),
                wait=wait_exponential(multiplier=1, min=1, max=10),
                retry=retry_if_exception_type(StripeError),
                reraise=True
            )
            def list_subscriptions():
                return stripe.Subscription.list(
                    customer=current_user.stripe_customer_id,
                    status="all",
                    limit=1
                )

            subscriptions = list_subscriptions()
            logger.info(f"Stripe returned {len(subscriptions.data)} subscriptions for customer: {current_user.stripe_customer_id}")

            if not subscriptions.data:
                logger.info(f"No subscriptions found in Stripe for customer: {current_user.stripe_customer_id}")
                return SubscriptionStatus(
                    hasSubscription=False,
                    isTrial=False,
                    isDeactivated=True
                )

            subscription = subscriptions.data[0]
            has_subscription = subscription.status in ["active", "trialing", "past_due"]
            is_trial = subscription.status == "trialing"
            is_deactivated = subscription.status in ["canceled", "unpaid", "incomplete_expired"]

            # Update database if Stripe indicates a subscription
            if has_subscription and not current_user.has_subscription:
                logger.warning(
                    f"Stripe indicates active subscription for user {current_user.email}, "
                    f"but has_subscription = 0 in database. Updating database."
                )
                current_user.has_subscription = 1
                db.add(current_user)
                db.commit()

            return SubscriptionStatus(
                hasSubscription=has_subscription,
                isTrial=is_trial,
                isDeactivated=is_deactivated
            )

        except StripeError as e:
            logger.error(f"Stripe error for user {current_user.email}: {str(e)}")
            return SubscriptionStatus(
                hasSubscription=False,
                isTrial=False,
                isDeactivated=True
            )

@router.get("/proxy-api/access", response_model=ProxyApiAccessResponse)
async def check_proxy_api_access(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Session = Depends(get_session)
):
    """
    Check if the user has access to proxy API features based on subscription metadata or database state.
    """
    logger.info(f"Checking proxy API access for user: {current_user.email}")

    if not stripe.api_key:
        logger.error("Stripe API key is not configured")
        raise HTTPException(status_code=500, detail="Server configuration error: Missing Stripe API key")

    # Allow access if database indicates subscription
    if current_user.has_subscription:
        logger.info(f"Database indicates has_subscription = 1, checking Stripe for proxy-api metadata for user: {current_user.email}")
    else:
        logger.info(f"No subscription in database for user: {current_user.email}, checking Stripe")

    if not current_user.stripe_customer_id or not validate_stripe_customer_id(current_user.stripe_customer_id):
        logger.warning(f"Invalid or missing Stripe customer ID for user: {current_user.email}")
        return ProxyApiAccessResponse(
            has_access=False,
            message="No valid subscription found. Please subscribe to a plan with proxy API features."
        )

    try:
        @retry(
            stop=stop_after_attempt(3),
            wait=wait_exponential(multiplier=1, min=1, max=10),
            retry=retry_if_exception_type(StripeError),
            reraise=True
        )
        def list_subscriptions():
            return stripe.Subscription.list(
                customer=current_user.stripe_customer_id,
                status=["active", "trialing"],
                expand=["data.plan.product"]
            )

        subscriptions = list_subscriptions()
        logger.info(f"Stripe returned {len(subscriptions.data)} subscriptions for customer: {current_user.stripe_customer_id}")

        for sub in subscriptions.data:
            log_details = {
                "subscription_id": sub.id,
                "status": sub.status,
                "current_period_start": getattr(sub, "current_period_start", None),
                "product_id": sub.plan.product.id if sub.plan and sub.plan.product else None,
                "metadata": (
                    sub.plan.product.metadata
                    if sub.plan and sub.plan.product and hasattr(sub.plan.product, "metadata")
                    else None
                )
            }
            logger.info(f"Proxy API check - Subscription details: {log_details}")

            metadata = (
                sub.plan.product.metadata
                if sub.plan and sub.plan.product and hasattr(sub.plan.product, "metadata")
                else {}
            )
            if metadata.get("proxy-api") == "true":
                # Ensure database consistency
                if not current_user.has_subscription:
                    logger.warning(
                        f"Stripe indicates proxy-api subscription for user {current_user.email}, "
                        f"but has_subscription = 0 in database. Updating database."
                    )
                    current_user.has_subscription = 1
                    db.add(current_user)
                    db.commit()

                return ProxyApiAccessResponse(
                    has_access=True,
                    message="Access granted to proxy API features."
                )

        # If database indicates subscription but no proxy-api metadata, deny access
        if current_user.has_subscription:
            logger.warning(
                f"Database indicates has_subscription = 1 for user {current_user.email}, "
                f"but no proxy-api metadata found in Stripe subscriptions."
            )
            return ProxyApiAccessResponse(
                has_access=False,
                message="Your subscription plan does not include proxy API features. Please upgrade to a proxy-api-enabled plan."
            )

        return ProxyApiAccessResponse(
            has_access=False,
            message="No active subscription found. Please subscribe to a plan with proxy API features."
        )

    except StripeError as e:
        logger.error(f"Stripe error for user {current_user.email}: {str(e)}")
        # Fallback to database state on Stripe error
        if current_user.has_subscription:
            return ProxyApiAccessResponse(
                has_access=False,
                message="Unable to verify proxy API access due to Stripe error. Contact support."
            )
        return ProxyApiAccessResponse(
            has_access=False,
            message="No subscription found. Please subscribe to a plan with proxy API features."
        )
    except Exception as e:
        logger.error(f"Internal server error for user {current_user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error")