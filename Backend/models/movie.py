from datetime import date
from sqlmodel import SQLModel, Field, Relationship
from .movie_genre_link import MovieGenreLink
from typing import TYPE_CHECKING

class Movie(SQLModel, table=True):
    __tablename__ = "movies"
    if TYPE_CHECKING:
        from .review import Review
        from .genre import Genre
    id: int | None = Field(default=None, primary_key=True)
    title: str
    director: str
    description: str
    image: str | None = None 
    release_date: date | None = None

    reviews: list[Review] = Relationship(back_populates="movie")
    genres: list[Genre] = Relationship(back_populates="movies", link_model=MovieGenreLink)



