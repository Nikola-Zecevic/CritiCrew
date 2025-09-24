from __future__ import annotations
from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship


class Role(SQLModel, table=True):
    __tablename__ = "roles"
    if TYPE_CHECKING:
        from .user import User

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str  

    users: list[User] = Relationship(back_populates="role")


