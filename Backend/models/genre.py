from sqlmodel import SQLModel, Field, Relationship
from .movie_genre_link import MovieGenreLink
from typing import TYPE_CHECKING, List, Optional

# OLD CODE - COMMENTED OUT (had forward reference issues):
# from typing import TYPE_CHECKING
# 
# class Genre(SQLModel, table=True):
#     __tablename__ = "genres"
#     if TYPE_CHECKING:
#         from .movie import Movie
#     id: int | None = Field(default=None, primary_key=True)
#     movies: list[Movie] = Relationship(back_populates="genres", link_model=MovieGenreLink)

# NEW WORKING CODE:
if TYPE_CHECKING:
    from .movie import Movie

class Genre(SQLModel, table=True):
    __tablename__ = "genres"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str

    movies: List["Movie"] = Relationship(back_populates="genres", link_model=MovieGenreLink)

