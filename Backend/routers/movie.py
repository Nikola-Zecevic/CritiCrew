from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session, select
from typing import List
from database.database import engine
from models.movie import Movie
from schemas.movie import MovieCreate, MovieRead

router = APIRouter(prefix="/movies", tags=["movies"])

# GET svi filmovi
@router.get("/", response_model=List[MovieRead])
def get_movies():
    with Session(engine) as session:
        statement = select(Movie)
        movies = session.exec(statement).all()
        return movies

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
