from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
import views.user as user_views  # for authentication
from database.database import get_session
from models.favorite import Favorite
from models.movie import Movie
from models.user import User
from schemas.favorite import FavoriteCreate, FavoriteRead, UserFavoritesResponse, MovieInFavorite

router = APIRouter(prefix="/favorites", tags=["favorites"])

# ---------------------
# Helper functions
# ---------------------

def require_logged_in_user(user: User = Depends(user_views.get_current_user2)) -> User:
    """Ensure the request is authenticated."""
    return user

def _get_favorite_or_404(user_id: int, movie_id: int, session: Session) -> Favorite:
    """Get a specific favorite or raise 404."""
    statement = select(Favorite).where(
        Favorite.user_id == user_id,
        Favorite.movie_id == movie_id
    )
    favorite = session.exec(statement).first()
    if not favorite:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Favorite not found"
        )
    return favorite

# ---------------------
# Read endpoints
# ---------------------

@router.get("/", response_model=UserFavoritesResponse)
def get_user_favorites(
    current_user: User = Depends(require_logged_in_user),
    session: Session = Depends(get_session)
):
    """Get all favorites for the current user."""
    statement = select(Favorite).where(Favorite.user_id == current_user.id)
    favorites = session.exec(statement).all()
    
    # Get movie details for each favorite
    movie_ids = [fav.movie_id for fav in favorites]
    movies_statement = select(Movie).where(Movie.id.in_(movie_ids))
    movies = session.exec(movies_statement).all()
    
    # Convert to response format
    movie_favorites = [
        MovieInFavorite(
            id=movie.id,
            title=movie.title,
            image=movie.image
        )
        for movie in movies
    ]
    
    return UserFavoritesResponse(
        user_id=current_user.id,
        favorites=movie_favorites
    )

@router.get("/check/{movie_id}")
def check_favorite_status(
    movie_id: int,
    current_user: User = Depends(require_logged_in_user),
    session: Session = Depends(get_session)
):
    """Check if a movie is favorited by the current user."""
    statement = select(Favorite).where(
        Favorite.user_id == current_user.id,
        Favorite.movie_id == movie_id
    )
    favorite = session.exec(statement).first()
    return {"is_favorite": favorite is not None}

# ---------------------
# Create endpoint
# ---------------------

@router.post("/", response_model=FavoriteRead, status_code=status.HTTP_201_CREATED)
def add_favorite(
    favorite_in: FavoriteCreate,
    current_user: User = Depends(require_logged_in_user),
    session: Session = Depends(get_session)
):
    """Add a movie to user's favorites."""
    movie_id = favorite_in.movie_id
    
    # Check if movie exists
    movie = session.get(Movie, movie_id)
    if not movie:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Movie not found"
        )
    
    # Check if already favorited
    existing_statement = select(Favorite).where(
        Favorite.user_id == current_user.id,
        Favorite.movie_id == movie_id
    )
    existing_favorite = session.exec(existing_statement).first()
    if existing_favorite:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Movie already in favorites"
        )
    
    # Create new favorite
    new_favorite = Favorite(
        user_id=current_user.id,
        movie_id=movie_id
    )
    session.add(new_favorite)
    session.commit()
    session.refresh(new_favorite)
    
    return new_favorite

# ---------------------
# Delete endpoint
# ---------------------

@router.delete("/{movie_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_favorite(
    movie_id: int,
    current_user: User = Depends(require_logged_in_user),
    session: Session = Depends(get_session)
):
    """Remove a movie from user's favorites."""
    favorite = _get_favorite_or_404(current_user.id, movie_id, session)
    session.delete(favorite)
    session.commit()
    return

# ---------------------
# Bulk operations (optional)
# ---------------------

@router.delete("/clear", status_code=status.HTTP_204_NO_CONTENT)
def clear_all_favorites(
    current_user: User = Depends(require_logged_in_user),
    session: Session = Depends(get_session)
):
    """Remove all favorites for the current user."""
    statement = select(Favorite).where(Favorite.user_id == current_user.id)
    favorites = session.exec(statement).all()
    
    for favorite in favorites:
        session.delete(favorite)
    
    session.commit()
    return