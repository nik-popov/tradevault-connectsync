from fastapi import APIRouter

from app.api.routes import items, login, private, users, utils,proxy,checkout,user_agent,subscription,serp
from app.core.config import settings

api_router = APIRouter()

# Existing routes
api_router.include_router(login.router)
api_router.include_router(users.router)
api_router.include_router(utils.router)
api_router.include_router(items.router)
api_router.include_router(subscription.router)  
api_router.include_router(checkout.router)
api_router.include_router(serp.router)


# New user_agent routes
api_router.include_router(
    user_agent.router)
api_router.include_router(proxy.router)


# Private routes for local environment
if settings.ENVIRONMENT == "local":
    api_router.include_router(private.router)
