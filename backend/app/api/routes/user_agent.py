# app/api/api_v1/endpoints/user_agents.py

import uuid
from typing import List
from sqlalchemy.sql import func
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
import requests
from bs4 import BeautifulSoup
import re

from app.api.deps import get_db
from app.models import (
    User,  # Import the placeholder User model
    UserAgent,
    UserAgentCreate,
    UserAgentUpdate,
    UserAgentPublic,
    UserAgentsPublic,
)
from app.crud import (
    create_user_agent,
    get_user_agent_by_id,
    get_all_user_agents,
    update_user_agent,
    delete_user_agent,
)

# --- Placeholder Admin Auth Dependency ---
# NOTE: For a real application, move this to `app/api/deps.py` and
# replace it with your actual authentication logic (e.g., OAuth2 with JWTs).
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user_placeholder(token: str = Depends(oauth2_scheme)) -> User:
    """
    This is a placeholder for your real user authentication.
    It simulates fetching a user based on a static token.
    """
    if token == "admin-secret-token":
        # In a real app, you would decode the token and get the user from the DB.
        return User(username="admin", is_superuser=True)
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

def get_current_active_superuser(
    current_user: User = Depends(get_current_user_placeholder),
) -> User:
    """Checks if the current user is a superuser."""
    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )
    return current_user
# --- End of Placeholder ---


router = APIRouter(prefix="/user-agents", tags=["user-agents"])

#
# --- Admin-Only Scraper Endpoint ---
#
@router.post("/update-from-source/", response_model=dict, status_code=status.HTTP_200_OK)
def update_user_agents_from_source(
    *,
    db: Session = Depends(get_db),
    # ✅ This dependency ensures only superusers can access this endpoint
    current_user: User = Depends(get_current_active_superuser),
):
    """
    (Admin only) Scrape user agents from an external source and update the database.

    This will:
    1. Scrape the latest user agents from useragents.me.
    2. For each unique user agent found, check if it already exists in the database.
    3. If it does not exist, add it.
    4. Return a summary of the operation.
    """
    print("🚀 Starting user agent update process triggered by admin...")

    try:
        scraped_entries = _scrape_user_agents_from_source()
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=502, detail=f"Failed to scrape source: {e}")

    if not scraped_entries:
        return {"status": "success", "message": "No new user agents found at the source."}
    
    unique_entries = _get_unique_user_agents(scraped_entries)

    # Fetch all existing user agent strings from the DB in one go for efficiency
    existing_ua_results = db.exec(select(UserAgent.user_agent)).all()
    existing_ua_strings = {ua_string for ua_string in existing_ua_results}
    print(f"🔍 Found {len(existing_ua_strings)} user agents already in the database.")

    added_count = 0
    newly_added_user_agents = []
    
    for entry in unique_entries:
        ua_string = entry.get("user_agent")
        if not ua_string or ua_string in existing_ua_strings:
            continue

        # Add the new user agent to the session for a bulk insert
        user_agent_to_add = UserAgentCreate.model_validate(entry)
        db_obj = UserAgent.model_validate(user_agent_to_add)
        db.add(db_obj)
        added_count += 1
        newly_added_user_agents.append(ua_string)
        existing_ua_strings.add(ua_string) # Add to set to handle duplicates in scraped data

    if added_count > 0:
        db.commit()
        print(f"✅ Committed {added_count} new user agents to the database.")
    
    return {
        "status": "success",
        "scraped_total": len(scraped_entries),
        "scraped_unique": len(unique_entries),
        "new_agents_added": added_count,
        "newly_added_sample": newly_added_user_agents[:5] # Show a sample
    }

#
# --- Standard CRUD Endpoints ---
#

@router.post("/", response_model=UserAgentPublic, status_code=status.HTTP_201_CREATED)
def create_user_agent_endpoint(user_agent_in: UserAgentCreate, db: Session = Depends(get_db)):
    """Create a new user agent entry, ensuring uniqueness."""
    existing = db.exec(select(UserAgent).where(UserAgent.user_agent == user_agent_in.user_agent)).first()
    if existing:
        raise HTTPException(status_code=409, detail="UserAgent with this string already exists")
    return create_user_agent(session=db, user_agent_create=user_agent_in)

@router.get("/", response_model=UserAgentsPublic)
def get_all_user_agents_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all user agents with pagination."""
    total_count = db.exec(select(func.count(UserAgent.id))).one()
    user_agents = get_all_user_agents(session=db, skip=skip, limit=limit)
    return UserAgentsPublic(data=user_agents, count=total_count)

@router.get("/{user_agent_id}", response_model=UserAgentPublic)
def get_user_agent_endpoint(user_agent_id: uuid.UUID, db: Session = Depends(get_db)):
    """Get a user agent by ID."""
    user_agent = get_user_agent_by_id(session=db, user_agent_id=user_agent_id)
    if not user_agent:
        raise HTTPException(status_code=404, detail="UserAgent not found")
    return user_agent

@router.put("/{user_agent_id}", response_model=UserAgentPublic)
def update_user_agent_endpoint(user_agent_id: uuid.UUID, user_agent_in: UserAgentUpdate, db: Session = Depends(get_db)):
    """Update a user agent entry."""
    db_user_agent = get_user_agent_by_id(session=db, user_agent_id=user_agent_id)
    if not db_user_agent:
        raise HTTPException(status_code=404, detail="UserAgent not found")
    return update_user_agent(session=db, db_user_agent=db_user_agent, user_agent_in=user_agent_in)

@router.delete("/{user_agent_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user_agent_endpoint(user_agent_id: uuid.UUID, db: Session = Depends(get_db)):
    """Delete a user agent entry."""
    deleted = delete_user_agent(session=db, user_agent_id=user_agent_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="UserAgent not found")
    # Return nothing on 204
    return None

#
# --- Helper Functions for Scraper ---
# Note: In a larger project, these would live in a separate `app/utils/scraper.py` file.
#

def _detect_device(ua_str: str) -> str:
    """Determine the device type from the user agent string."""
    ua_str_lower = ua_str.lower()
    if "mobile" in ua_str_lower or "android" in ua_str_lower or "iphone" in ua_str_lower:
        return "mobile"
    if "tablet" in ua_str_lower or "ipad" in ua_str_lower:
        return "tablet"
    return "desktop"

def _extract_browser_os(ua_str: str) -> tuple[str, str]:
    """Extract browser and OS information."""
    browser_map = {"chrome": "Chrome", "firefox": "Firefox", "safari": "Safari", "edge": "Edge", "opera": "Opera"}
    os_map = {"windows": "Windows", "macintosh": "macOS", "linux": "Linux", "android": "Android", "like mac os x": "iOS"}
    
    ua_str_lower = ua_str.lower()
    browser = "Unknown"
    for key, name in browser_map.items():
        if key in ua_str_lower:
            browser = name
            # Safari is often in other UAs, so check it's not Chrome or Edge
            if browser == "Safari" and ("chrome" in ua_str_lower or "edg" in ua_str_lower):
                continue
            break # Found one

    os = "Unknown"
    for key, name in os_map.items():
        if key in ua_str_lower:
            os = name
            break
            
    return browser, os

def _scrape_user_agents_from_source() -> list[dict]:
    """Scrape the webpage and extract full user agent data."""
    SOURCE_URL = "https://www.useragents.me/"
    HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"}
    
    response = requests.get(SOURCE_URL, headers=HEADERS)
    response.raise_for_status() # Raise an exception for bad status codes

    soup = BeautifulSoup(response.text, "lxml")
    user_agents = []
    
    for row in soup.select("table tr"):
        columns = row.find_all("td")
        if len(columns) < 2:
            continue

        percentage_text = columns[0].text.strip()
        user_agent_str = columns[1].get("data-full-ua", columns[1].text.strip())

        if not user_agent_str or "more info" in user_agent_str or len(user_agent_str) < 10:
            continue

        percentage_match = re.search(r"^\d+(\.\d+)?", percentage_text)
        percentage = float(percentage_match.group()) if percentage_match else 0.0
        
        device = _detect_device(user_agent_str)
        browser, os = _extract_browser_os(user_agent_str)

        user_agents.append({
            "user_agent": user_agent_str,
            "device": device,
            "browser": browser,
            "os": os,
            "percentage": percentage,
        })
    return user_agents

def _get_unique_user_agents(entries: list[dict]) -> list[dict]:
    """Return a list of unique user agent entries, keeping the first occurrence."""
    unique_dict = {}
    for entry in entries:
        ua = entry["user_agent"]
        if ua not in unique_dict:
            unique_dict[ua] = entry
    return list(unique_dict.values())