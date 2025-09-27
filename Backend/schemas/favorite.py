from pydantic import BaseModel
from typing import Optional

# Minimal info about user and movie for displaying in favorites
class UserInFavorite(BaseModel):
    id: int
    username: str

class MovieInFavorite(BaseModel):
    id: int
    title: str
    image: Optional[str] = None

class FavoriteBase(BaseModel):
    movie_id: int

class FavoriteCreate(FavoriteBase):
    # user_id will come from authentication, not from request
    pass

class FavoriteRead(BaseModel):
    id: int
    user_id: int
    movie_id: int
    user: Optional[UserInFavorite] = None
    movie: Optional[MovieInFavorite] = None

class UserFavoritesResponse(BaseModel):
    user_id: int
    favorites: list[MovieInFavorite]