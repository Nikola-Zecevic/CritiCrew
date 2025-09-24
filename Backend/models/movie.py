from datetime import date
from sqlmodel import SQLModel, Field, Relationship
from .movie_genre_link import MovieGenreLink
from typing import TYPE_CHECKING, List, Optional


if TYPE_CHECKING:
    from .review import Review
    from .genre import Genre

class Movie(SQLModel, table=True):
    __tablename__ = "movies"

    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    director: str
    description: str
    image: Optional[str] = None
    release_date: Optional[date] = None

    reviews: List["Review"] = Relationship(back_populates="movie")
    genres: List["Genre"] = Relationship(back_populates="movies", link_model=MovieGenreLink)



