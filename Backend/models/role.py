from typing import Optional, TYPE_CHECKING, List
from sqlmodel import SQLModel, Field, Relationship

# OLD CODE - COMMENTED OUT (had forward reference issues):
# from __future__ import annotations
# from typing import Optional, TYPE_CHECKING
# from sqlmodel import SQLModel, Field, Relationship
# 
# class Role(SQLModel, table=True):
#     __tablename__ = "roles"
#     if TYPE_CHECKING:
#         from .user import User
# 
#     id: Optional[int] = Field(default=None, primary_key=True)
#     name: str  
# 
#     users: list[User] = Relationship(back_populates="role")

# NEW WORKING CODE:
if TYPE_CHECKING:
    from .user import User

if TYPE_CHECKING:
    from .user import User

class Role(SQLModel, table=True):
    __tablename__ = "roles"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    users: List["User"] = Relationship(back_populates="role")