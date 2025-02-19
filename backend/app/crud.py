import uuid

from sqlmodel import Session, select

from typing import Any, List, Optional

from app.core.security import get_password_hash, verify_password
from app.models import Item, ItemCreate, User, UserCreate, UserUpdate
from app.models import UserAgent, UserAgentCreate, UserAgentUpdate


from sqlalchemy.exc import IntegrityError
from sqlmodel import select
from app.models import UserAgent

def create_user_agent(session: Session, user_agent_create: UserAgentCreate):
    # Check if the user agent already exists
    existing_ua = session.exec(
        select(UserAgent).where(UserAgent.user_agent == user_agent_create.user_agent)
    ).first()
    
    if existing_ua:
        # If the user agent already exists, update its values instead of inserting a duplicate
        existing_ua.device = user_agent_create.device
        existing_ua.browser = user_agent_create.browser
        existing_ua.os = user_agent_create.os
        existing_ua.percentage = user_agent_create.percentage
        session.add(existing_ua)
    else:
        # If it does not exist, insert a new record
        db_user_agent = UserAgent.model_validate(user_agent_create)
        session.add(db_user_agent)

    try:
        session.commit()
        session.refresh(existing_ua if existing_ua else db_user_agent)
    except IntegrityError:
        session.rollback()
        return {"error": "Duplicate user agent entry"}
    
    return existing_ua if existing_ua else db_user_agent


def get_user_agent_by_id(*, session: Session, user_agent_id: uuid.UUID) -> Optional[UserAgent]:
    """Fetches a UserAgent by its ID."""
    return session.get(UserAgent, user_agent_id)


def get_user_agent_by_string(*, session: Session, user_agent: str) -> Optional[UserAgent]:
    """Fetches a UserAgent by its string value."""
    statement = select(UserAgent).where(UserAgent.user_agent == user_agent)
    return session.exec(statement).first()


def get_all_user_agents(*, session: Session, skip: int = 0, limit: int = 100) -> List[UserAgent]:
    """Fetches all UserAgents with pagination."""
    statement = select(UserAgent).offset(skip).limit(limit)
    return session.exec(statement).all()


def update_user_agent(*, session: Session, db_user_agent: UserAgent, user_agent_in: UserAgentUpdate) -> UserAgent:
    """Updates a UserAgent entry with the provided data."""
    user_agent_data = user_agent_in.model_dump(exclude_unset=True)
    db_user_agent.sqlmodel_update(user_agent_data)
    session.add(db_user_agent)
    session.commit()
    session.refresh(db_user_agent)
    return db_user_agent


def delete_user_agent(*, session: Session, user_agent_id: uuid.UUID) -> bool:
    """Deletes a UserAgent entry from the database."""
    db_user_agent = get_user_agent_by_id(session=session, user_agent_id=user_agent_id)
    if not db_user_agent:
        return False
    session.delete(db_user_agent)
    session.commit()
    return True

def create_user(*, session: Session, user_create: UserCreate) -> User:
    db_obj = User.model_validate(
        user_create, update={"hashed_password": get_password_hash(user_create.password)}
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj


def update_user(*, session: Session, db_user: User, user_in: UserUpdate) -> Any:
    user_data = user_in.model_dump(exclude_unset=True)
    extra_data = {}
    if "password" in user_data:
        password = user_data["password"]
        hashed_password = get_password_hash(password)
        extra_data["hashed_password"] = hashed_password
    db_user.sqlmodel_update(user_data, update=extra_data)
    session.add(db_user)
    session.commit()
    session.refresh(db_user)
    return db_user


def get_user_by_email(*, session: Session, email: str) -> User | None:
    statement = select(User).where(User.email == email)
    session_user = session.exec(statement).first()
    return session_user


def authenticate(*, session: Session, email: str, password: str) -> User | None:
    db_user = get_user_by_email(session=session, email=email)
    if not db_user:
        return None
    if not verify_password(password, db_user.hashed_password):
        return None
    return db_user


def create_item(*, session: Session, item_in: ItemCreate, owner_id: uuid.UUID) -> Item:
    db_item = Item.model_validate(item_in, update={"owner_id": owner_id})
    session.add(db_item)
    session.commit()
    session.refresh(db_item)
    return db_item
