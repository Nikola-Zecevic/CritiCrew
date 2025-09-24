from datetime import datetime
from typing import Optional, TYPE_CHECKING
from sqlmodel import SQLModel, Field, Relationship

# OLD CODE - COMMENTED OUT (had forward reference issues):
# from datetime import datetime
# from typing import Optional, TYPE_CHECKING
# from sqlmodel import SQLModel, Field, Relationship
# # from .user import User
# # from .movie import Movie
# 
# class Review(SQLModel, table=True):
#     __tablename__ = "reviews"
# 
#     if TYPE_CHECKING:
#         from .user import User
#         from .movie import Movie
# 
#     id: int | None = Field(default=None, primary_key=True)
#     rating: int
#     review_text: str
#     review_date: datetime = Field(default_factory=datetime.now())
# 
#     user_id: int | None = Field(default=None, foreign_key="users.id")
#     movie_id: int | None = Field(default=None, foreign_key="movies.id")
# 
#     user: Optional[User]= Relationship(back_populates="reviews")
#     movie: Optional[Movie]= Relationship(back_populates="reviews")

# NEW WORKING CODE:
if TYPE_CHECKING:
    from .user import User
    from .movie import Movie

class Review(SQLModel, table=True):
    __tablename__ = "reviews"

    id: Optional[int] = Field(default=None, primary_key=True)
    rating: int
    review_text: str
    review_date: datetime = Field(default_factory=datetime.now)

    user_id: Optional[int] = Field(default=None, foreign_key="users.id")
    movie_id: Optional[int] = Field(default=None, foreign_key="movies.id")

    user: Optional["User"] = Relationship(back_populates="reviews")
    movie: Optional["Movie"] = Relationship(back_populates="reviews")