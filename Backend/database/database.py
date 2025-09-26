from sqlmodel import SQLModel, create_engine, Session
from .config import settings

engine = create_engine(settings.db_url, echo=True, pool_pre_ping=True)


def init_db():
    
    SQLModel.metadata.create_all(engine)


def get_session():
    
    with Session(engine) as session:
        yield session

def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()

