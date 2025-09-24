from sqlmodel import SQLModel, create_engine, Session
from .config import settings
from models.user import User
from models.role import Role
from models.movie import Movie
from models.genre import Genre
from models.review import Review
from models.movie_genre_link import MovieGenreLink


engine = create_engine(settings.db_url, echo=True)


def init_db():
    
    SQLModel.metadata.create_all(engine)


def get_session():
    
    with Session(engine) as session:
        yield session