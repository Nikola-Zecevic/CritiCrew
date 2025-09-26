from pydantic import BaseModel
from typing import Optional
from datetime import date

class MovieBase(BaseModel):
    title: str
    director: str
    description: str
    image: Optional[str] = None
    release_date: Optional[date] = None

class MovieCreate(MovieBase):
    pass

class MovieRead(MovieBase):
    id: int

class MovieReadWithGenres(MovieBase):
    """Movie schema with genres for enhanced API responses"""
    id: int
    genres: list[str] = []
    rating: float = 0.0

class MovieResponse(BaseModel):
    """Schema for frontend response with calculated fields"""
    id: int
    title: str
    director: str
    year: int
    rating: float
    description: str
    genres: list[str]
    image: Optional[str] = None
    slug: str
