from typing import Optional, TYPE_CHECKING, List
from sqlmodel import SQLModel, Field, Relationship


if TYPE_CHECKING:
    from .user import User

class Role(SQLModel, table=True):
    __tablename__ = "roles"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    users: List["User"] = Relationship(back_populates="role")