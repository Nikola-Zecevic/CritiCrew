from datetime import datetime
from pydantic import BaseModel
from typing import Optional

# Minimal info about user and movie for displaying in review
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
    # 🚫 no user_id here – it comes from the logged-in user automatically

class ReviewRead(ReviewBase):
    id: int
    review_date: datetime
    user: Optional[UserInReview] = None
    movie: Optional[MovieInReview] = None