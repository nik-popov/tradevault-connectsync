import uuid
from typing import Optional, List
from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel, Column, DateTime
from sqlalchemy.sql import func
from datetime import datetime

# ===============================================================================
# User Models
# ===============================================================================

# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: Optional[str] = Field(default=None, max_length=255)
    has_subscription: bool = Field(default=False)
    is_trial: bool = Field(default=False)
    is_deactivated: bool = Field(default=False)
    stripe_customer_id: Optional[str] = Field(default=None, unique=True, nullable=True)

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=40)

class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: Optional[str] = Field(default=None, max_length=255)

# Properties to receive via API on update
class UserUpdate(UserBase):
    email: Optional[EmailStr] = Field(default=None, max_length=255)
    password: Optional[str] = Field(default=None, min_length=8, max_length=40)

class UserUpdateMe(SQLModel):
    full_name: Optional[str] = Field(default=None, max_length=255)
    email: Optional[EmailStr] = Field(default=None, max_length=255)

class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)

# Database model
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str
    expiry_date: Optional[datetime] = Field(default=None)
    items: List["Item"] = Relationship(back_populates="owner", sa_relationship_kwargs={"cascade": "all, delete-orphan"})
    

# Properties to return via API
class UserPublic(UserBase):
    id: uuid.UUID
    # ✅ Expose timestamps to the client
    created_at: datetime
    updated_at: Optional[datetime] = None

class UsersPublic(SQLModel):
    data: List[UserPublic]
    count: int

# ===============================================================================
# UserAgent Models
# ===============================================================================

class UserAgentBase(SQLModel):
    user_agent: str = Field(unique=True, index=True, max_length=512)
    device: str = Field(default="desktop", max_length=50)
    browser: Optional[str] = Field(default=None, max_length=100)
    os: Optional[str] = Field(default=None, max_length=100)
    percentage: Optional[float] = Field(default=None)

class UserAgentCreate(UserAgentBase):
    pass

class UserAgentUpdate(SQLModel):
    user_agent: Optional[str] = Field(default=None, max_length=512)
    device: Optional[str] = Field(default=None, max_length=50)
    browser: Optional[str] = Field(default=None, max_length=100)
    os: Optional[str] = Field(default=None, max_length=100)
    percentage: Optional[float] = Field(default=None)

class UserAgent(UserAgentBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    
    # ✅ Added created_at timestamp as requested
    created_at: datetime = Field(
        sa_column=Column(
            DateTime(timezone=True),
            nullable=False,
            server_default=func.now()
        )
    )

class UserAgentPublic(UserAgentBase):
    id: uuid.UUID
    # ✅ Expose the created_at field
    created_at: datetime

class UserAgentsPublic(SQLModel):
    data: List[UserAgentPublic]
    count: int

# ===============================================================================
# Item Models
# ===============================================================================

class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: Optional[str] = Field(default=None, max_length=255)

class ItemCreate(ItemBase):
    pass

class ItemUpdate(ItemBase):
    title: Optional[str] = Field(default=None, min_length=1, max_length=255)

class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    owner_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    owner: User = Relationship(back_populates="items")

    # ✅ Best Practice: Add created_at and updated_at timestamps
    created_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), nullable=False, server_default=func.now())
    )
    updated_at: datetime = Field(
        sa_column=Column(DateTime(timezone=True), nullable=True, server_default=func.now(), onupdate=func.now())
    )

class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID
    # ✅ Expose timestamps to the client
    created_at: datetime
    updated_at: Optional[datetime] = None

class ItemsPublic(SQLModel):
    data: List[ItemPublic]
    count: int

# ===============================================================================
# Miscellaneous Models
# ===============================================================================

class Message(SQLModel):
    message: str

class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"

class TokenPayload(SQLModel):
    sub: Optional[str] = None

class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)

class SubscriptionStatus(SQLModel):
    hasSubscription: bool
    isTrial: bool
    isDeactivated: bool