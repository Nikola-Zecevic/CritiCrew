from sqlmodel import SQLModel, create_engine, Session, select
from .config import settings
from models.user import User
from models.role import Role
from models.movie import Movie
from models.genre import Genre
from models.review import Review
from models.movie_genre_link import MovieGenreLink



# Configure engine with SSL settings for Aiven
engine = create_engine(
    settings.db_url,
    echo=True,
    connect_args={
        "ssl_disabled": False,
        "charset": "utf8mb4"
    }
)

#engine = create_engine(settings.db_url, echo=True, pool_pre_ping=True)



def init_db():
    # Create all tables
    SQLModel.metadata.create_all(engine)
    
    # Initialize default roles
    with Session(engine) as session:
        from models.role import Role
        
        # Check if roles exist, if not create them
        if not session.exec(select(Role).where(Role.name == "regular")).first():
            regular_role = Role(name="regular")
            session.add(regular_role)
        
        if not session.exec(select(Role).where(Role.name == "admin")).first():
            admin_role = Role(name="admin") 
            session.add(admin_role)
            
        if not session.exec(select(Role).where(Role.name == "superadmin")).first():
            superadmin_role = Role(name="superadmin")
            session.add(superadmin_role)
        
        session.commit()


def get_session():
    
    with Session(engine) as session:

        yield session

def get_db():
    db = Session(engine)
    try:
        yield db
    finally:
        db.close()


