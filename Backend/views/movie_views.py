from sqlmodel import Session, select, func
from typing import List, Optional
from models.movie import Movie
from models.genre import Genre
from models.movie_genre_link import MovieGenreLink
from models.review import Review

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

def get_movies_with_filters(session: Session, genre: Optional[str] = None, sort: Optional[str] = "desc") -> List[Movie]:
    """Get movies with optional genre filtering - business logic"""
    statement = select(Movie)
    movies = session.exec(statement).all()

    # Filter by genre if specified
    if genre:
        filtered = []
        for movie in movies:
            if movie.id is not None:
                movie_genres = get_movie_genres(session, movie.id)
                if genre in movie_genres:
                    filtered.append(movie)
        movies = filtered
    
    return movies

def build_movie_response_data(session: Session, movie: Movie) -> dict:
    """Build enhanced movie response data with genres, rating, and slug"""
    if movie.id is None:
        return None
        
    rating = get_movie_rating(session, movie.id)
    genres = get_movie_genres(session, movie.id)
    slug = create_movie_slug(movie.title)
    
    return {
        "id": movie.id,
        "title": movie.title,
        "director": movie.director,
        "description": movie.description,
        "image": movie.image,
        "release_date": movie.release_date,
        "genres": genres,
        "rating": rating,
        "slug": slug
    }