import uuid
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.api.deps import get_db
from app.models import (
    UserAgent,
    UserAgentCreate,
    UserAgentUpdate,
    UserAgentPublic,
    UserAgentsPublic
)
from app.crud import (
    create_user_agent,
    get_user_agent_by_id,
    get_all_user_agents,
    update_user_agent,
    delete_user_agent
)

router = APIRouter(tags=["user-agents"])

# ✅ Ensure uniqueness before inserting
@router.post("/", response_model=UserAgentPublic)
def create_user_agent_endpoint(user_agent_in: UserAgentCreate, db: Session = Depends(get_db)):
    """
    Create a new user agent entry, ensuring uniqueness.
    """
    existing_user_agent = db.exec(select(UserAgent).where(UserAgent.user_agent == user_agent_in.user_agent)).first()
    if existing_user_agent:
        raise HTTPException(status_code=409, detail="UserAgent already exists")

    return create_user_agent(session=db, user_agent_create=user_agent_in)


# ✅ Fetch a user agent by ID
@router.get("/{user_agent_id}", response_model=UserAgentPublic)
def get_user_agent_endpoint(user_agent_id: uuid.UUID, db: Session = Depends(get_db)):
    """
    Get a user agent by ID.
    """
    user_agent = get_user_agent_by_id(session=db, user_agent_id=user_agent_id)
    if not user_agent:
        raise HTTPException(status_code=404, detail="UserAgent not found")
    return user_agent


# ✅ Ensure correct pagination & total count
@router.get("/", response_model=UserAgentsPublic)
def get_all_user_agents_endpoint(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """
    Get all user agents with pagination.
    """
    total_count = db.exec(select(UserAgent)).count()  # Get total count
    user_agents = get_all_user_agents(session=db, skip=skip, limit=limit)

    return UserAgentsPublic(data=user_agents, count=total_count)


# ✅ Update an existing user agent
@router.put("/{user_agent_id}", response_model=UserAgentPublic)
def update_user_agent_endpoint(user_agent_id: uuid.UUID, user_agent_in: UserAgentUpdate, db: Session = Depends(get_db)):
    """
    Update a user agent entry.
    """
    db_user_agent = get_user_agent_by_id(session=db, user_agent_id=user_agent_id)
    if not db_user_agent:
        raise HTTPException(status_code=404, detail="UserAgent not found")

    return update_user_agent(session=db, db_user_agent=db_user_agent, user_agent_in=user_agent_in)


# ✅ Delete an existing user agent
@router.delete("/{user_agent_id}", response_model=bool)
def delete_user_agent_endpoint(user_agent_id: uuid.UUID, db: Session = Depends(get_db)):
    """
    Delete a user agent entry.
    """
    deleted = delete_user_agent(session=db, user_agent_id=user_agent_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="UserAgent not found")
    return deleted
