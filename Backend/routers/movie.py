from fastapi import APIRouter, HTTPException, Depends, Query, status
from sqlmodel import Session, select
from typing import List, Optional
from database.database import engine
from models.movie import Movie
from schemas.movie import MovieCreate, MovieRead, MovieReadWithGenres
from views.movie_views import (
    get_movie_rating, 
    get_movie_genres, 
    create_movie_slug,
    get_movies_with_filters,
    build_movie_response_data
)
from routers.user import require_admin_or_superadmin, User

router = APIRouter(prefix="/movies", tags=["movies"])

# GET svi filmovi with optional filtering
@router.get("/", response_model=List[MovieReadWithGenres])
def get_movies(
    genre: Optional[str] = Query(None, description="Filter by genre name"),
    sort: Optional[str] = Query("desc", description="Sort by rating: 'asc' or 'desc'")
):
    with Session(engine) as session:
        # Use view function for filtering logic
        movies = get_movies_with_filters(session, genre, sort)

        # Build response with calculated fields using view function
        movie_responses = []
        for movie in movies:
            if movie.id is None:
                continue  # Skip movies without id
                
            response_data = build_movie_response_data(session, movie)
            if response_data:
                movie_response = MovieReadWithGenres(**response_data)
                movie_responses.append(movie_response)
        
        # Sort by rating
        if sort == "asc":
            movie_responses.sort(key=lambda x: x.rating)
        else:  # desc
            movie_responses.sort(key=lambda x: x.rating, reverse=True)
        
        return movie_responses

# GET film po id
@router.get("/{movie_id}", response_model=MovieReadWithGenres)
def get_movie(movie_id: int):
    with Session(engine) as session:
        movie = session.get(Movie, movie_id)
        if not movie:
            raise HTTPException(status_code=404, detail="Movie not found")
        
        # Ensure movie has valid ID
        if movie.id is None:
            raise HTTPException(status_code=404, detail="Movie not found")
        
        # Use view function to build response data
        response_data = build_movie_response_data(session, movie)
        if not response_data:
            raise HTTPException(status_code=404, detail="Movie not found")
        
        return MovieReadWithGenres(**response_data)

# POST novi film (admin/superadmin)
@router.post("/", response_model=MovieRead)
def create_movie(movie: MovieCreate, current_user: User = Depends(require_admin_or_superadmin)):
    
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
def delete_movie(movie_id: int, current_user: User = Depends(require_admin_or_superadmin)):
    
    with Session(engine) as session:
        movie = session.get(Movie, movie_id)
        if not movie:
            raise HTTPException(status_code=404, detail="Movie not found")
        session.delete(movie)
        session.commit()
        return {"message": "Movie deleted"}

# PUT update filma 
@router.put("/{movie_id}", response_model=MovieRead)
def update_movie(movie_id: int, movie_update: MovieCreate, current_user: User = Depends(require_admin_or_superadmin)):
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
