from typing import Optional
from sqlmodel import SQLModel, Field, Relationship
# from .user import User


class Role(SQLModel, table=True):
    __tablename__ = "roles"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str  

    users: list["User"] = Relationship(back_populates="role")


