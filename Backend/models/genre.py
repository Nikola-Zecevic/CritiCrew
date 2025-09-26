from sqlmodel import SQLModel, Field, Relationship
from .movie_genre_link import MovieGenreLink
from typing import TYPE_CHECKING, List, Optional

if TYPE_CHECKING:
    from .movie import Movie

class Genre(SQLModel, table=True):
    __tablename__ = "genres"

    id: Optional[int] = Field(default=None, primary_key=True)

    name: str = Field(unique=True, index=True)

    movies: List["Movie"] = Relationship(back_populates="genres", link_model=MovieGenreLink)

