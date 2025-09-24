from __future__ import annotations
from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
# from .role import Role
# from .review import Review


class User(SQLModel, table=True):
    __tablename__ = "users"
    if TYPE_CHECKING:
        from .role import Role
        from .review import Review

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    surname: str
    address: Optional[str]  = None
    email: str = Field(index=True, unique=True)
    username: str = Field(index=True, unique=True)
    hashed_password: str    

    role_id: Optional[int] = Field(default=None, foreign_key="roles.id")

    role: Optional[Role]= Relationship(back_populates="users")
    reviews: list[Review] = Relationship(back_populates="user")

