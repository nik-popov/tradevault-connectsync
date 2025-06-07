# app/api/api_v1/endpoints/user_agents.py

import uuid
from typing import List
from sqlalchemy.sql import func
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
import requests
from bs4 import BeautifulSoup
import re

# ✅ Using centralized dependencies for session and user authentication
from app.api import deps
from app.api.deps import SessionDep, CurrentUser
from app.models import (
    User,
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

router = APIRouter(prefix="/user-agents", tags=["user-agents"])


@router.post(
    "/update-from-source/",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    # ✅ Protected endpoint: Only superusers can trigger this
    dependencies=[Depends(deps.get_current_active_superuser)],
)
def update_user_agents_from_source(session: SessionDep):
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

    existing_ua_results = session.exec(select(UserAgent.user_agent)).all()
    existing_ua_strings = {ua_string for ua_string in existing_ua_results}
    print(f"🔍 Found {len(existing_ua_strings)} user agents already in the database.")

    added_count = 0
    newly_added_user_agents = []

    for entry in unique_entries:
        ua_string = entry.get("user_agent")
        if not ua_string or ua_string in existing_ua_strings:
            continue

        user_agent_to_add = UserAgentCreate.model_validate(entry)
        db_obj = UserAgent.model_validate(user_agent_to_add)
        session.add(db_obj)
        added_count += 1
        newly_added_user_agents.append(ua_string)
        existing_ua_strings.add(ua_string)

    if added_count > 0:
        session.commit()
        print(f"✅ Committed {added_count} new user agents to the database.")

    return {
        "status": "success",
        "scraped_total": len(scraped_entries),
        "scraped_unique": len(unique_entries),
        "new_agents_added": added_count,
        "newly_added_sample": newly_added_user_agents[:5],
    }


@router.post(
    "/",
    response_model=UserAgentPublic,
    status_code=status.HTTP_201_CREATED,
    # ✅ Protected endpoint
    dependencies=[Depends(deps.get_current_active_superuser)],
)
def create_user_agent_endpoint(session: SessionDep, user_agent_in: UserAgentCreate):
    """Create a new user agent entry (Admin only)."""
    existing = session.exec(select(UserAgent).where(UserAgent.user_agent == user_agent_in.user_agent)).first()
    if existing:
        raise HTTPException(status_code=409, detail="UserAgent with this string already exists")
    return create_user_agent(session=session, user_agent_create=user_agent_in)


@router.get("/", response_model=UserAgentsPublic)
def get_all_user_agents_endpoint(session: SessionDep, skip: int = 0, limit: int = 100):
    """Get all user agents with pagination."""
    total_count = session.exec(select(func.count(UserAgent.id))).one()
    user_agents = get_all_user_agents(session=session, skip=skip, limit=limit)
    return UserAgentsPublic(data=user_agents, count=total_count)


@router.get("/{user_agent_id}", response_model=UserAgentPublic)
def get_user_agent_endpoint(session: SessionDep, user_agent_id: uuid.UUID):
    """Get a user agent by ID."""
    user_agent = get_user_agent_by_id(session=session, user_agent_id=user_agent_id)
    if not user_agent:
        raise HTTPException(status_code=404, detail="UserAgent not found")
    return user_agent


@router.put(
    "/{user_agent_id}",
    response_model=UserAgentPublic,
    # ✅ Protected endpoint
    dependencies=[Depends(deps.get_current_active_superuser)],
)
def update_user_agent_endpoint(
    session: SessionDep, user_agent_id: uuid.UUID, user_agent_in: UserAgentUpdate
):
    """Update a user agent entry (Admin only)."""
    db_user_agent = get_user_agent_by_id(session=session, user_agent_id=user_agent_id)
    if not db_user_agent:
        raise HTTPException(status_code=404, detail="UserAgent not found")
    return update_user_agent(session=session, db_user_agent=db_user_agent, user_agent_in=user_agent_in)


@router.delete(
    "/{user_agent_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    # ✅ Protected endpoint
    dependencies=[Depends(deps.get_current_active_superuser)],
)
def delete_user_agent_endpoint(session: SessionDep, user_agent_id: uuid.UUID):
    """Delete a user agent entry (Admin only)."""
    deleted = delete_user_agent(session=session, user_agent_id=user_agent_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="UserAgent not found")
    return None

#
# --- Helper Functions for Scraper ---
# Note: In a larger project, these would live in a separate `app/utils/scraper.py` file.
#
def _detect_device(ua_str: str) -> str:
    ua_str_lower = ua_str.lower()
    if "mobile" in ua_str_lower or "android" in ua_str_lower or "iphone" in ua_str_lower:
        return "mobile"
    if "tablet" in ua_str_lower or "ipad" in ua_str_lower:
        return "tablet"
    return "desktop"

def _extract_browser_os(ua_str: str) -> tuple[str, str]:
    browser_map = {"chrome": "Chrome", "firefox": "Firefox", "safari": "Safari", "edge": "Edge", "opera": "Opera"}
    os_map = {"windows": "Windows", "macintosh": "macOS", "linux": "Linux", "android": "Android", "like mac os x": "iOS"}
    ua_str_lower = ua_str.lower()
    browser = next((name for key, name in browser_map.items() if key in ua_str_lower and not (name == "Safari" and ("chrome" in ua_str_lower or "edg" in ua_str_lower))), "Unknown")
    os = next((name for key, name in os_map.items() if key in ua_str_lower), "Unknown")
    return browser, os

def _scrape_user_agents_from_source() -> list[dict]:
    SOURCE_URL = "https://www.useragents.me/"
    HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"}
    response = requests.get(SOURCE_URL, headers=HEADERS, timeout=10)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "lxml")
    user_agents = []
    for row in soup.select("table tr"):
        columns = row.find_all("td")
        if len(columns) < 2: continue
        user_agent_str = columns[1].get("data-full-ua", columns[1].text.strip())
        if not user_agent_str or "more info" in user_agent_str or len(user_agent_str) < 10: continue
        percentage_match = re.search(r"^\d+(\.\d+)?", columns[0].text.strip())
        percentage = float(percentage_match.group()) if percentage_match else 0.0
        device, (browser, os) = _detect_device(user_agent_str), _extract_browser_os(user_agent_str)
        user_agents.append({"user_agent": user_agent_str, "device": device, "browser": browser, "os": os, "percentage": percentage})
    return user_agents

def _get_unique_user_agents(entries: list[dict]) -> list[dict]:
    return list({entry["user_agent"]: entry for entry in entries}.values())