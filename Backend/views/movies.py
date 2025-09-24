from fastapi import APIRouter, Query
from sqlmodel import Session, select, func
from typing import List, Optional
from database.database import engine
from models.movie import Movie
from models.genre import Genre
from models.movie_genre_link import MovieGenreLink
from models.review import Review
from schemas.movies import MovieResponse

router = APIRouter(prefix="/movies-view", tags=["movies-view"])

def get_movie_rating(session: Session, movie_id: Optional[int]) -> float:
    """Calculate average rating for a movie from reviews"""
    if movie_id is None:
        return 0.0
        
    result = session.exec(
        select(func.avg(Review.rating)).where(Review.movie_id == movie_id)
    ).first()
    return round(float(result), 1) if result else 0.0

def get_movie_genres(session: Session, movie_id: Optional[int]) -> List[str]:
    """Get all genre names for a movie"""
    if movie_id is None:
        return []
        
    genre_ids = session.exec(
        select(MovieGenreLink.genre_id).where(MovieGenreLink.movie_id == movie_id)
    ).all()
    
    if not genre_ids:
        return []
    
    # Get genres one by one to avoid in_ issues
    genres = []
    for genre_id in genre_ids:
        if genre_id is not None:
            genre_name = session.exec(
                select(Genre.name).where(Genre.id == genre_id)
            ).first()
            if genre_name:
                genres.append(genre_name)
    
    return genres

def create_movie_slug(title: str) -> str:
    """Create URL-friendly slug from movie title"""
    return title.lower().replace(" ", "-").replace(":", "").replace("'", "")

# GET /movies-view/filter?genre=Action&sort=desc
@router.get("/filter", response_model=List[MovieResponse])
def filter_movies(
    genre: Optional[str] = None,
    sort: Optional[str] = "desc"  # rating asc/desc
):
    with Session(engine) as session:
        statement = select(Movie)
        movies = session.exec(statement).all()

        # filter po žanru
        if genre:
            filtered = []
            for m in movies:
                if m.id is not None:
                    movie_genres = get_movie_genres(session, m.id)
                    if genre in movie_genres:
                        filtered.append(m)
            movies = filtered

        # Build response with calculated fields
        movie_responses = []
        for movie in movies:
            if movie.id is None:
                continue  # Skip movies without id
                
            rating = get_movie_rating(session, movie.id)
            genres = get_movie_genres(session, movie.id)
            
            movie_response = MovieResponse(
                id=movie.id,
                title=movie.title,
                director=movie.director,
                year=movie.release_date.year if movie.release_date else 0,
                rating=rating,
                description=movie.description,
                genres=genres,
                image=movie.image,
                slug=create_movie_slug(movie.title)
            )
            movie_responses.append(movie_response)
        
        # Sort by rating or year
        if sort == "asc":
            movie_responses.sort(key=lambda x: x.rating)
        else:  # desc
            movie_responses.sort(key=lambda x: x.rating, reverse=True)
        
        return movie_responses

@router.get("/", response_model=List[MovieResponse])
def get_all_movies():
    """Get all movies with ratings and genres"""
    return filter_movies()
