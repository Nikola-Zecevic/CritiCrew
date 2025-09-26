from fastapi import APIRouter, HTTPException, Depends, Query
from sqlmodel import Session, select, func
from typing import List, Optional
from database.database import engine
from models.movie import Movie
from models.genre import Genre
from models.movie_genre_link import MovieGenreLink
from models.review import Review
from schemas.movie import MovieCreate, MovieRead, MovieReadWithGenres

router = APIRouter(prefix="/movies", tags=["movies"])

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

# GET svi filmovi with optional filtering
@router.get("/", response_model=List[MovieReadWithGenres])
def get_movies(
    genre: Optional[str] = Query(None, description="Filter by genre name"),
    sort: Optional[str] = Query("desc", description="Sort by rating: 'asc' or 'desc'")
):
    with Session(engine) as session:
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

        # Build response with calculated fields
        movie_responses = []
        for movie in movies:
            if movie.id is None:
                continue  # Skip movies without id
                
            rating = get_movie_rating(session, movie.id)
            genres = get_movie_genres(session, movie.id)
            
            movie_response = MovieReadWithGenres(
                id=movie.id,
                title=movie.title,
                director=movie.director,
                description=movie.description,
                image=movie.image,
                release_date=movie.release_date,
                genres=genres,
                rating=rating
            )
            movie_responses.append(movie_response)
        
        # Sort by rating
        if sort == "asc":
            movie_responses.sort(key=lambda x: x.rating)
        else:  # desc
            movie_responses.sort(key=lambda x: x.rating, reverse=True)
        
        return movie_responses

# GET film po id
@router.get("/{movie_id}", response_model=MovieRead)
def get_movie(movie_id: int):
    with Session(engine) as session:
        movie = session.get(Movie, movie_id)
        if not movie:
            raise HTTPException(status_code=404, detail="Movie not found")
        return movie

# POST novi film (admin/superadmin)
@router.post("/", response_model=MovieRead)
def create_movie(movie: MovieCreate):
    # TODO: check admin/superadmin
    with Session(engine) as session:
        # Get all existing movie IDs to find the next available ID
        existing_movies = session.exec(select(Movie)).all()
        existing_ids = [movie.id for movie in existing_movies if movie.id is not None]
        existing_ids.sort()
        
        # Calculate the next available ID
        next_id = 1
        for existing_id in existing_ids:
            if existing_id == next_id:
                next_id += 1
            else:
                break  # Found a gap, use next_id
        
        # Create movie with calculated ID
        movie_data = movie.model_dump()
        movie_data['id'] = next_id
        
        new_movie = Movie(**movie_data)
        session.add(new_movie)
        session.commit()
        session.refresh(new_movie)
        return new_movie

# DELETE film po id (admin/superadmin)
@router.delete("/{movie_id}")
def delete_movie(movie_id: int):
    # TODO: check admin/superadmin
    with Session(engine) as session:
        movie = session.get(Movie, movie_id)
        if not movie:
            raise HTTPException(status_code=404, detail="Movie not found")
        session.delete(movie)
        session.commit()
        return {"message": "Movie deleted"}

# PUT update filma 
@router.put("/{movie_id}", response_model=MovieRead)
def update_movie(movie_id: int, movie_update: MovieCreate):
    # TODO: check admin/superadmin
    with Session(engine) as session:
        movie = session.get(Movie, movie_id)
        if not movie:
            raise HTTPException(status_code=404, detail="Movie not found")
        
        update_data = movie_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(movie, field, value)
        
        session.add(movie)
        session.commit()
        session.refresh(movie)
        return movie
