from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship
from sqlalchemy import UniqueConstraint

if TYPE_CHECKING:
    from .user import User
    from .movie import Movie

class Favorite(SQLModel, table=True):
    __tablename__ = "favorites"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id")
    movie_id: int = Field(foreign_key="movies.id")
    
    # Add unique constraint to prevent duplicate favorites
    __table_args__ = (UniqueConstraint('user_id', 'movie_id', name='unique_user_movie_favorite'),)

    # Relationships
    user: Optional["User"] = Relationship(back_populates="favorites")
    movie: Optional["Movie"] = Relationship(back_populates="favorited_by")