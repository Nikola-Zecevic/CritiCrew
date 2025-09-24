from pydantic import BaseModel
from typing import Optional

class MovieBase(BaseModel):
    title: str
    year: int
    description: Optional[str] = None
    image: Optional[str] = None
    genre: Optional[str] = None
    slug: Optional[str] = None
    rating: Optional[float] = 0.0  # prosečna ocena, placeholder za sada

class MovieCreate(MovieBase):
    pass

class MovieRead(MovieBase):
    id: int

