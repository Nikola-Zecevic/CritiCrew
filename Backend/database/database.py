from sqlmodel import SQLModel, create_engine, Session
from .config import settings

engine = create_engine(settings.db_url, echo=True)


def init_db():
    """
    For development only: create tables automatically.
    In production, rely on Alembic migrations instead.
    """
    SQLModel.metadata.create_all(engine)


def get_session():
    """
    Dependency for FastAPI routes.
    Usage: Depends(get_session) in your endpoints.
    """
    with Session(engine) as session:
        yield session



# from sqlmodel import SQLModel, create_engine, Session
# from .config import get_database_url

# DATABASE_URL = get_database_url()
# engine = create_engine(DATABASE_URL, echo=True)  # echo=True logs SQL queries

# def init_db():
#     SQLModel.metadata.create_all(engine)

# def get_session():
#     with Session(engine) as session:
#         yield session