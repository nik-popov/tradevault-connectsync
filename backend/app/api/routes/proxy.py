from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, Header
from typing import Annotated, Dict, List, Optional
from pydantic import BaseModel
import httpx
import logging
import asyncio
import time
import random
import uuid
from datetime import datetime, timedelta
from app.api.deps import SessionDep, CurrentUser
from app.models import User
from app.core.security import generate_api_key, verify_api_key
from app.api.routes import users
from sqlalchemy.orm import Session
from sqlmodel import SQLModel, Field
from uuid import UUID,uuid4
from app.utils import generate_test_email, send_email
logging.basicConfig(level=logging.DEBUG)
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
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    token: str = Field(unique=True)
    user_id: UUID = Field(foreign_key="user.id", index=True)
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
    logger.debug(f"Verifying API key: {x_api_key[:8]}...")
    if not x_api_key:
        raise HTTPException(status_code=401, detail="API key required")
    
    token_data = verify_api_key(x_api_key)
    if not token_data or "user_id" not in token_data:
        logger.info("Invalid API key")
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    user = users.read_user_by_id(session=session, user_id=token_data["user_id"], current_user=CurrentUser)
    if not user or not user.is_active:
        logger.info("Invalid or inactive user")
        raise HTTPException(status_code=401, detail="Invalid or inactive user")
    
    if not user.has_subscription and not (user.is_trial and user.expiry_date and user.expiry_date > datetime.utcnow()):
        logger.info("User lacks active subscription or trial")
        raise HTTPException(status_code=403, detail="Active subscription or trial required")
    
    logger.debug("API key verified")
    return user

# API Endpoints
@router.post("/generate-api-key", response_model=dict)
async def generate_user_api_key(session: SessionDep, current_user: CurrentUser):
    logger.debug(f"Generating API key for user: {current_user.email}")
    if not current_user.has_subscription and not (current_user.is_trial and current_user.expiry_date and current_user.expiry_date > datetime.utcnow()):
        logger.info(f"User {current_user.email} lacks active subscription or trial")
        raise HTTPException(status_code=403, detail="Active subscription or trial required")
    
    try:
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
        logger.debug(f"API key generated for user: {current_user.email}")
        return {"api_key": api_key}
    except Exception as e:
        logger.error(f"Failed to generate API key for user {current_user.email}: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to generate API key: {str(e)}")

@router.get("/regions", response_model=RegionsResponse)
async def list_regions(
    user: Annotated[User, Depends(verify_api_token)],
    session: SessionDep
):
    logger.debug(f"Listing regions for user: {user.email}")
    return RegionsResponse(regions=list(REGION_ENDPOINTS.keys()))

@router.get("/status", response_model=ProxyStatusResponse)
async def get_proxy_status(
    region: str,
    user: Annotated[User, Depends(verify_api_token)],
    session: SessionDep
):
    logger.debug(f"Checking proxy status for region: {region}, user: {user.email}")
    if region not in REGION_ENDPOINTS:
        logger.info(f"Invalid region: {region}")
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
    logger.debug(f"Proxy status retrieved for region: {region}")
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
    logger.debug(f"Proxy fetch request for region: {region}, user: {user.email}")
    if region not in REGION_ENDPOINTS:
        logger.info(f"Invalid region: {region}")
        raise HTTPException(status_code=400, detail=f"Invalid region. Available regions: {list(REGION_ENDPOINTS.keys())}")
    
    token = session.query(APIToken).filter(
        APIToken.token == x_api_key,
        APIToken.user_id == str(user.id),
        APIToken.is_active == True
    ).first()
    if not token:
        logger.info("Invalid API key for fetch")
        raise HTTPException(status_code=401, detail="Invalid API key")
    
    endpoints = REGION_ENDPOINTS[region]
    status_tasks = [check_proxy_health(endpoint, region) for endpoint in endpoints]
    results = await asyncio.gather(*status_tasks)
    
    healthy_endpoints = [endpoints[i] for i, result in enumerate(results) if result["is_healthy"]]
    if not healthy_endpoints:
        logger.error(f"No healthy proxy endpoints in {region}")
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
            
            token.request_count += 1
            session.commit()
            
            logger.debug(f"Proxy fetch successful in {region}")
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
    logger.debug(f"Listing API keys for user: {current_user.email}")
    if not current_user.has_subscription and not (current_user.is_trial and current_user.expiry_date and current_user.expiry_date > datetime.utcnow()):
        logger.info(f"User {current_user.email} lacks active subscription or trial")
        raise HTTPException(status_code=403, detail="Active subscription or trial required")
    
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
    logger.debug(f"Retrieved {len(key_list)} API keys")
    return key_list

@router.delete("/api-keys/{key_preview}", status_code=204)
async def delete_api_key(
    key_preview: str,
    session: SessionDep,
    current_user: CurrentUser,
    background_tasks: BackgroundTasks
):
    logger.debug(f"Deleting API key with preview: {key_preview}, user: {current_user.email}")
    if not current_user.has_subscription and not (current_user.is_trial and current_user.expiry_date and current_user.expiry_date > datetime.utcnow()):
        logger.info(f"User {current_user.email} lacks active subscription or trial")
        raise HTTPException(status_code=403, detail="Active subscription or trial required")

    key_preview_short = key_preview[-END_PREVIEW_LENGTH:]
    token = session.query(APIToken).filter(
        APIToken.user_id == str(current_user.id),
        APIToken.token.like(f"%{key_preview_short}"),
        APIToken.is_active == True
    ).first()

    if not token:
        logger.info(f"API key deletion attempted but not found. User: {current_user.id}, Preview: {key_preview_short}")
        raise HTTPException(status_code=404, detail="API key not found")

    user_data = {
        "id": str(current_user.id),
        "email": current_user.email,
        "full_name": current_user.full_name,
        "is_active": current_user.is_active,
        "has_subscription": current_user.has_subscription
    }

    token_data = {
        "token_preview": f"{token.token[:FRONT_PREVIEW_LENGTH]}...{token.token[-END_PREVIEW_LENGTH:]}",
        "full_token": token.token,
        "created_at": token.created_at.isoformat(),
        "expires_at": token.expires_at.isoformat(),
        "is_active": token.is_active,
        "request_count": token.request_count
    }

    session.delete(token)
    session.commit()

    def send_deletion_notification():
        try:
            html_content = f"""
            <html>
            <body>
                <h1>API Key Deletion Notification</h1>
                <p>An API Key has been deleted from the system.</p>
                
                <h2>User Details</h2>
                <p><strong>ID:</strong> {user_data['id']}</p>
                <p><strong>Email:</strong> {user_data['email']}</p>
                <p><strong>Full Name:</strong> {user_data['full_name']}</p>
                <p><strong>Active:</strong> {user_data['is_active']}</p>
                <p><strong>Has Subscription:</strong> {user_data['has_subscription']}</p>
                
                <h2>Deleted API Key Details</h2>
                <p><strong>Token Preview:</strong> {token_data['token_preview']}</p>
                <p><strong>Full Token:</strong> {token_data['full_token']}</p>
                <p><strong>Created At:</strong> {token_data['created_at']}</p>
                <p><strong>Expires At:</strong> {token_data['expires_at']}</p>
                <p><strong>Was Active:</strong> {token_data['is_active']}</p>
                <p><strong>Request Count:</strong> {token_data['request_count']}</p>
                
                <p><strong>Deletion Time:</strong> {datetime.utcnow().isoformat()}</p>
            </body>
            </html>
            """
            
            email_success = send_email(
                email_to="internal@thedataproxy.com",
                subject=f"API Key Deletion Notification - User {user_data['id']}",
                html_content=html_content
            )
            
            if not email_success:
                logger.error("Failed to send API key deletion notification email")
            else:
                logger.info(f"Deletion notification sent for token {token_data['token_preview']}")
                
        except Exception as e:
            logger.error(f"Error sending deletion notification email: {str(e)}")

    background_tasks.add_task(send_deletion_notification)
    logger.debug("API key deleted")
    return None