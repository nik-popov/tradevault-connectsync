from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Header
from typing import Annotated, Dict, List, Optional
from pydantic import BaseModel
import httpx
import logging
import asyncio
import time
import random,uuid
from datetime import datetime, timedelta
from app.api.deps import SessionDep, CurrentUser
from app.models import User
from app.core.security import generate_api_key, verify_api_key
from app.api.routes import users
from sqlalchemy.orm import Session
from sqlmodel import SQLModel, Field  # Added for APIToken definition
from uuid import UUID
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define regions and their corresponding endpoints
REGION_ENDPOINTS = {
    "us-east": [
        "https://us-east4-proxy1-454912.cloudfunctions.net/main",
        "https://us-east1-proxy1-454912.cloudfunctions.net/main",
        "https://us-east5-proxy2-455013.cloudfunctions.net/main"
    ],
    "us-west": [
        "https://us-west1-proxy1-454912.cloudfunctions.net/main",
        "https://us-west3-proxy1-454912.cloudfunctions.net/main",
        "https://us-west4-proxy1-454912.cloudfunctions.net/main",
        "https://us-west2-proxy2-455013.cloudfunctions.net/main"
    ],
    "us-central": [
        "https://us-central1-proxy1-454912.cloudfunctions.net/main",
        "https://us-central1-proxy2-455013.cloudfunctions.net/main",
        "https://us-south1-proxy3-455013.cloudfunctions.net/main"
    ],
    "northamerica-northeast": [
        "https://northamerica-northeast1-proxy2-455013.cloudfunctions.net/main",
        "https://northamerica-northeast2-proxy2-455013.cloudfunctions.net/main"
    ],
    "southamerica": [
        "https://southamerica-west1-proxy1-454912.cloudfunctions.net/main",
        "https://southamerica-east1-proxy3-455013.cloudfunctions.net/main",
        "https://southamerica-west1-proxy3-455013.cloudfunctions.net/main"
    ],
    "asia": [
        "https://asia-east1-proxy6-455014.cloudfunctions.net/main",
        "https://asia-northeast2-proxy6-455014.cloudfunctions.net/main"
    ],
    "australia": [
        "https://australia-southeast1-proxy3-455013.cloudfunctions.net/main",
        "https://australia-southeast2-proxy3-455013.cloudfunctions.net/main"
    ],
    "europe": [
        "https://europe-north1-proxy4-455014.cloudfunctions.net/main",
        "https://europe-southwest1-proxy4-455014.cloudfunctions.net/main",
        "https://europe-west1-proxy4-455014.cloudfunctions.net/main",
        "https://europe-west4-proxy4-455014.cloudfunctions.net/main",
        "https://europe-west6-proxy4-455014.cloudfunctions.net/main",
        "https://europe-west8-proxy4-455014.cloudfunctions.net/main",
        "https://europe-west12-proxy5-455014.cloudfunctions.net/main",
        "https://europe-west2-proxy5-455014.cloudfunctions.net/main",
        "https://europe-west3-proxy5-455014.cloudfunctions.net/main",
        "https://europe-west6-proxy5-455014.cloudfunctions.net/main",
        "https://europe-west9-proxy5-455014.cloudfunctions.net/main",
        "https://europe-west10-proxy6-455014.cloudfunctions.net/main"
    ],
    "middle-east": [
        "https://me-central1-proxy6-455014.cloudfunctions.net/main",
        "https://me-west1-proxy6-455014.cloudfunctions.net/main"
    ]
}

router = APIRouter(tags=["proxy"], prefix="/proxy")

# APIToken Model Definition
class APIToken(SQLModel, table=True):
    __tablename__ = "apitoken"
    id: Optional[int] = Field(default=None, primary_key=True)
    token: str = Field(unique=True)
    user_id: UUID = Field(foreign_key="user.id", index=True)  # Change to UUID
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime
    is_active: bool = Field(default=True)
    request_count: int = Field(default=0)

# Other Models
class RegionsResponse(BaseModel):
    regions: List[str]

class APIKeyResponse(BaseModel):
    key_preview: str
    created_at: str
    expires_at: str
    is_active: bool
    request_count: int

class ProxyStatus(BaseModel):
    region: str
    is_healthy: bool
    avg_response_time: float
    healthy_endpoints: int
    total_endpoints: int
    last_checked: datetime

class ProxyStatusResponse(BaseModel):
    statuses: List[ProxyStatus]

class ProxyRequest(BaseModel):
    url: str

class ProxyResponse(BaseModel):
    result: str
    public_ip: str
    device_id: str
    region_used: str

# Health check function
async def check_proxy_health(endpoint: str, region: str) -> Dict:
    start_time = time.time()
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            response = await client.get(f"{endpoint}/health")
            response.raise_for_status()
            response_time = time.time() - start_time
            return {
                "region": region,
                "is_healthy": True,
                "response_time": response_time,
                "last_checked": datetime.utcnow()
            }
    except Exception as e:
        logger.error(f"Health check failed for {endpoint} in {region}: {str(e)}")
        return {
            "region": region,
            "is_healthy": False,
            "response_time": time.time() - start_time,
            "last_checked": datetime.utcnow()
        }

# Custom dependency for API key verification
async def verify_api_token(
    session: SessionDep,
    x_api_key: Annotated[str, Header()] = None
) -> User:
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required")
    
    token_data = verify_api_key(x_api_key)
    if not token_data or "user_id" not in token_data:
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    user = users.read_user_by_id(session=session, user_id=token_data["user_id"], current_user=CurrentUser)
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Invalid or inactive user")
    
    if not user.has_subscription:
        raise HTTPException(status_code=403, detail="Active subscription required")
    
    return user

# API Endpoints
@router.post("/generate-api-key", response_model=dict)
async def generate_user_api_key(session: SessionDep, current_user: CurrentUser):
    if not current_user.has_subscription:
        raise HTTPException(status_code=403, detail="Active subscription required")
    
    api_key = generate_api_key(user_id=str(current_user.id))
    token = APIToken(
        user_id=str(current_user.id),
        token=api_key,
        created_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(days=365),
        is_active=True,
        request_count=0
    )
    session.add(token)
    session.commit()
    session.refresh(token)
    return {"api_key": api_key}

@router.get("/regions", response_model=RegionsResponse)
async def list_regions(
    user: Annotated[User, Depends(verify_api_token)],
    session: SessionDep
):
    return RegionsResponse(regions=list(REGION_ENDPOINTS.keys()))

@router.get("/status", response_model=ProxyStatusResponse)
async def get_proxy_status(
    region: str,
    user: Annotated[User, Depends(verify_api_token)],
    session: SessionDep
):
    if region not in REGION_ENDPOINTS:
        raise HTTPException(status_code=400, detail=f"Invalid region. Available regions: {list(REGION_ENDPOINTS.keys())}")
    
    endpoints = REGION_ENDPOINTS[region]
    status_tasks = [check_proxy_health(endpoint, region) for endpoint in endpoints]
    results = await asyncio.gather(*status_tasks)
    
    healthy_count = sum(1 for r in results if r["is_healthy"])
    total_count = len(endpoints)
    avg_response_time = sum(r["response_time"] for r in results) / total_count if total_count > 0 else 0
    
    status = ProxyStatus(
        region=region,
        is_healthy=healthy_count > 0,
        avg_response_time=avg_response_time,
        healthy_endpoints=healthy_count,
        total_endpoints=total_count,
        last_checked=results[0]["last_checked"] if results else datetime.utcnow()
    )
    return ProxyStatusResponse(statuses=[status])

@router.post("/fetch", response_model=ProxyResponse)
async def proxy_fetch(
    session: SessionDep,
    region: str,
    request: ProxyRequest,
    user: Annotated[User, Depends(verify_api_token)],
    background_tasks: BackgroundTasks,
    x_api_key: Annotated[str, Header()] = None
):
    if region not in REGION_ENDPOINTS:
        raise HTTPException(status_code=400, detail=f"Invalid region. Available regions: {list(REGION_ENDPOINTS.keys())}")
    
    # Verify and increment request counter
    token = session.query(APIToken).filter(
        APIToken.token == x_api_key,
        APIToken.user_id == str(user.id),
        APIToken.is_active == True
    ).first()
    if not token:
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    endpoints = REGION_ENDPOINTS[region]
    status_tasks = [check_proxy_health(endpoint, region) for endpoint in endpoints]
    results = await asyncio.gather(*status_tasks)
    
    healthy_endpoints = [endpoints[i] for i, result in enumerate(results) if result["is_healthy"]]
    if not healthy_endpoints:
        raise HTTPException(status_code=503, detail=f"No healthy proxy endpoints available in {region}")
    
    selected_endpoint = random.choice(healthy_endpoints)
    
    try:
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(
                f"{selected_endpoint}/fetch",
                json={"url": request.url}
            )
            response.raise_for_status()
            data = response.json()
            
            # Increment request counter after successful fetch
            token.request_count += 1
            session.commit()
            
            return ProxyResponse(
                result=data["result"],
                public_ip=data["public_ip"],
                device_id=data["device_id"],
                region_used=region
            )
    except Exception as e:
        logger.error(f"Proxy fetch failed in {region}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Proxy request failed in {region}: {str(e)}")

FRONT_PREVIEW_LENGTH = 8
END_PREVIEW_LENGTH = 8

@router.get("/api-keys", response_model=List[APIKeyResponse])
async def list_user_api_keys(session: SessionDep, current_user: CurrentUser):
    if not current_user.has_subscription:
        raise HTTPException(status_code=403, detail="Active subscription required")
    
    api_tokens = session.query(APIToken).filter(
        APIToken.user_id == str(current_user.id),
        APIToken.is_active == True
    ).all()
    
    key_list = [
        {
            "key_preview": f"{token.token[:FRONT_PREVIEW_LENGTH]}...{token.token[-END_PREVIEW_LENGTH:]}",
            "created_at": token.created_at.isoformat(),
            "expires_at": token.expires_at.isoformat(),
            "is_active": token.is_active,
            "request_count": token.request_count
        }
        for token in api_tokens
    ]
    return key_list
from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from sqlalchemy.orm import Session
from app.api.deps import SessionDep, CurrentUser
from app.models import User
from app.core.security import verify_api_key

# Assuming the APIToken model and router are already defined as in your code
class APIKeyDeleteRequest(BaseModel):
    api_key: str  # The full API key to delete

class APIKeyDeleteResponse(BaseModel):
    message: str
    deleted_key_preview: str

@router.delete("/api-keys", response_model=APIKeyDeleteResponse)
async def delete_user_api_key(
    session: SessionDep,
    current_user: CurrentUser,
    request: APIKeyDeleteRequest
):
    """
    Delete an API key for the authenticated user.
    
    Args:
        session: Database session dependency
        current_user: Authenticated user from dependency
        request: Request body containing the API key to delete
    
    Returns:
        APIKeyDeleteResponse with confirmation message and key preview
    
    Raises:
        HTTPException: If user lacks subscription, key doesn't exist, or doesn't belong to user
    """
    if not current_user.has_subscription:
        raise HTTPException(status_code=403, detail="Active subscription required")

    # Verify the API key and extract user_id from it
    token_data = verify_api_key(request.api_key)
    if not token_data or "user_id" not in token_data:
        raise HTTPException(status_code=400, detail="Invalid API key format")

    # Ensure the key belongs to the current user
    if str(token_data["user_id"]) != str(current_user.id):
        raise HTTPException(status_code=403, detail="API key does not belong to this user")

    # Find the API key in the database
    api_token = session.query(APIToken).filter(
        APIToken.token == request.api_key,
        APIToken.user_id == current_user.id,
        APIToken.is_active == True
    ).first()

    if not api_token:
        raise HTTPException(status_code=404, detail="API key not found or already inactive")

    # Option 1: Soft delete by marking as inactive
    api_token.is_active = False
    session.commit()

    # Option 2: Hard delete (uncomment if preferred)
    # session.delete(api_token)
    # session.commit()

    # Generate a preview of the deleted key
    key_preview = f"{api_token.token[:FRONT_PREVIEW_LENGTH]}...{api_token.token[-END_PREVIEW_LENGTH:]}"

    return APIKeyDeleteResponse(
        message="API key successfully deleted",
        deleted_key_preview=key_preview
    )