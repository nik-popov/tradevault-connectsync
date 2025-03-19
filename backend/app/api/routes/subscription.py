# app/api/endpoints/subscription.py
from fastapi import APIRouter
from app.models import SubscriptionStatus, User
from typing import Annotated
from fastapi import Depends

router = APIRouter()

@router.get("/subscription-status/serp", response_model=SubscriptionStatus)
async def get_subscription_status(current_user: Annotated[User, Depends(get_current_user)]):
    """
    Retrieve the subscription status for the authenticated user.
    """
    return SubscriptionStatus(
        hasSubscription=current_user.has_subscription,
        isTrial=current_user.is_trial,
        isDeactivated=current_user.is_deactivated
    )