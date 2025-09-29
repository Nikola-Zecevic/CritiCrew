from sqlmodel import SQLModel, Field


class MovieGenreLink(SQLModel, table=True):
    __tablename__ = "movie_genre_link"

    movie_id: int|None = Field(default=None, foreign_key="movies.id", primary_key=True)
    genre_id: int|None = Field(default=None, foreign_key="genres.id", primary_key=True)