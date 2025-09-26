from datetime import datetime
from pydantic import BaseModel
from typing import Optional
	
# Minimal info o useru i filmu za prikaz u reviewu
class UserInReview(BaseModel):
    id: int
    username: str

class MovieInReview(BaseModel):
    id: int
    title: str

class ReviewBase(BaseModel):
    rating: int
    review_text: str

class ReviewCreate(ReviewBase):
    movie_id: int
    user_id: int

class ReviewRead(ReviewBase):
    id: int
    review_date: datetime
    user: Optional[UserInReview] = None
    movie: Optional[MovieInReview] = None
