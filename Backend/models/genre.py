from sqlmodel import SQLModel, Field, Relationship
from .movie_genre_link import MovieGenreLink
from typing import TYPE_CHECKING

class Genre(SQLModel, table=True):
    __tablename__ = "genres"
    if TYPE_CHECKING:
        from .movie import Movie
    id: int | None = Field(default=None, primary_key=True)
    name: str

    movies: list[Movie] = Relationship(back_populates="genres", link_model=MovieGenreLink)

