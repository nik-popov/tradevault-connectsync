import uuid
from datetime import datetime
from typing import Optional

from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel

# Shared properties
class UserAgentBase(SQLModel):
    user_agent: str = Field(unique=True, index=True, max_length=512)
    device: str = Field(default="desktop", max_length=50)  # e.g., desktop, mobile, tablet
    browser: str | None = Field(default=None, max_length=100)
    os: str | None = Field(default=None, max_length=100)
    percentage: float | None = Field(default=None)  # Percentage usage if applicable

class UserAgentCreate(UserAgentBase):
    pass

class UserAgentUpdate(SQLModel):
    user_agent: str | None = Field(default=None, max_length=512)
    device: str | None = Field(default=None, max_length=50)
    browser: str | None = Field(default=None, max_length=100)
    os: str | None = Field(default=None, max_length=100)
    percentage: float | None = Field(default=None)

class UserAgent(UserAgentBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)

class UserAgentPublic(UserAgentBase):
    id: uuid.UUID

class UserAgentsPublic(SQLModel):
    data: list[UserAgentPublic]
    count: int

# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)
    has_subscription: bool = Field(default=False)  # Tracks active paid subscription
    is_trial: bool = Field(default=False)         # Tracks trial status
    is_deactivated: bool = Field(default=False)   # Tracks if subscription is deactivated
    expiry_date: Optional[datetime] = Field(default=None)  # Added to track trial expiration

class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)

class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)

class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)
    password: str | None = Field(default=None, min_length=8, max_length=40)

class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)

class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)

class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)

class UserPublic(UserBase):
    id: uuid.UUID

class SubscriptionStatus(SQLModel):
    hasSubscription: bool
    isTrial: bool
    isDeactivated: bool

class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int

# Item models (unchanged)
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)

class ItemCreate(ItemBase):
    pass

class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)

class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False, ondelete="CASCADE")
    owner: User | None = Relationship(back_populates="items")

class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID

class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int

class Message(SQLModel):
    message: str

class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"

class TokenPayload(SQLModel):
    sub: str | None = None

class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)