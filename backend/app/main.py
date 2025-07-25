import sentry_sdk
from fastapi import FastAPI
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware

from app.api.main import api_router
from app.core.config import settings


def custom_generate_unique_id(route: APIRoute) -> str:
    return f"{route.tags[0]}-{route.name}"


if settings.SENTRY_DSN and settings.ENVIRONMENT != "local":
    sentry_sdk.init(dsn=str(settings.SENTRY_DSN), enable_tracing=True)

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    generate_unique_id_function=custom_generate_unique_id,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://cloud.tradevaultco.com","https://api.tradevaultco.com","https://fictional-tribble-pjp4gqxr5pjx2rq6g-5173.app.github.dev"],  # Specify your frontend origin
    # allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "OPTIONS","DELETE"],
    allow_headers=["*"],
)
app.include_router(api_router, prefix=settings.API_V1_STR)
