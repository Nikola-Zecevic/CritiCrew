from typing import List, Optional, Any
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlmodel import Session, select
import views.user as user_views  # assumes views.user.get_current_user2 exists
from database.database import get_session
from models.review import Review
from models.movie import Movie
from models.user import User
from schemas.review import ReviewCreate, ReviewRead
router = APIRouter(prefix="/reviews", tags=["reviews"])
# ---------------------
# Helpers / auth checks
# ---------------------


def _role_name_of_user(user: Optional[User]) -> Optional[str]:
    """Safe role name getter (works if user.role is None)."""
    return getattr(getattr(user, "role", None), "name", None)


def is_admin_or_superadmin(user: User) -> bool:
    return _role_name_of_user(user) in ("admin", "superadmin")


def require_logged_in_user(user: User = Depends(user_views.get_current_user2)) -> User:
    """Ensure the request is authenticated (get_current_user2 should raise 401 if not)."""
    return user


def _get_review_or_404(review_id: int, session: Session) -> Review:
    review = session.get(Review, review_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
    return review


def require_review_owner(
    review_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_logged_in_user),
) -> Review:
    """
    Dependency: ensures the current user is the review owner.
    Returns the Review instance (fewer DB round trips in handlers).
    """
    review = _get_review_or_404(review_id, session)
    if review.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                            detail="Only the review owner can perform this action")
    return review


def require_review_owner_or_admin(
    review_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(require_logged_in_user),
) -> Review:
    """
    Dependency: owner OR admin/superadmin allowed.
    Returns the Review instance.
    """
    review = _get_review_or_404(review_id, session)
    if review.user_id == current_user.id or is_admin_or_superadmin(current_user):
        return review
    raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                        detail="Operation not permitted")
# ---------------------
# Read endpoints
# ---------------------


@router.get("/", response_model=List[ReviewRead])
def list_reviews(movie_id: Optional[int] = Query(None, description="Optional filter by movie_id"),
                 session: Session = Depends(get_session)):
    """
    List reviews. Optional filter by movie_id.
    """
    stmt = select(Review)
    if movie_id is not None:
        stmt = stmt.where(Review.movie_id == movie_id)
    reviews = session.exec(stmt).all()
    return reviews


@router.get("/{review_id}", response_model=ReviewRead)
def get_review(review_id: int, session: Session = Depends(get_session)):
    """
    Get a single review by id.
    """
    return _get_review_or_404(review_id, session)
# ---------------------
# Create (any logged-in user)
# ---------------------


@router.post("/", response_model=ReviewRead, status_code=status.HTTP_201_CREATED)
def create_review(
    review_in: ReviewCreate,
    current_user: User = Depends(require_logged_in_user),
    session: Session = Depends(get_session),
):
    payload = review_in.model_dump() if hasattr(review_in, "model_dump") else review_in.dict()

    movie_id = payload.get("movie_id")
    if not movie_id:
        raise HTTPException(status_code=422, detail="movie_id is required")

    movie = session.get(Movie, movie_id)
    if not movie:
        raise HTTPException(status_code=404, detail="Movie not found")

    rating = payload.get("rating")
    if rating is not None and (not isinstance(rating, int) or not (1 <= rating <= 10)):
        raise HTTPException(status_code=422, detail="rating must be an integer between 1 and 10")

    # 🚫 Ignore any user_id from client
    payload["user_id"] = current_user.id

    new_review = Review(**payload)
    session.add(new_review)
    session.commit()
    session.refresh(new_review)
    return new_review
# ---------------------
# Update (ONLY owner)
# ---------------------


@router.put("/{review_id}", response_model=ReviewRead)
def update_review(
    review_id: int,
    review_update: ReviewCreate,
    # returns the Review instance
    review: Review = Depends(require_review_owner),
    session: Session = Depends(get_session),
):
    """
    Only the review owner may update their review.
    This disallows changing ownership or the movie association.
    """
    # Support Pydantic v2 or v1 partial dump
    if hasattr(review_update, "model_dump"):
        update_data = review_update.model_dump(exclude_unset=True)
    else:
        update_data = review_update.dict(exclude_unset=True)
    # Prevent changing ownership / movie / id via this endpoint
    for forbidden in ("user_id", "movie_id", "id"):
        update_data.pop(forbidden, None)
    # Validate rating if provided
    if "rating" in update_data:
        r = update_data["rating"]
        if not isinstance(r, int) or not (1 <= r <= 10):
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                                detail="rating must be an integer between 1 and 10")
    for field, value in update_data.items():
        setattr(review, field, value)
    session.add(review)
    session.commit()
    session.refresh(review)
    return review
# ---------------------
# Delete (owner OR admin/superadmin)
# ---------------------


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: int,
    # ensures owner OR admin
    review: Review = Depends(require_review_owner_or_admin),
    session: Session = Depends(get_session),
):
    session.delete(review)
    session.commit()
    return
