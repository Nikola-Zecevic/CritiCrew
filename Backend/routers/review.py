from fastapi import APIRouter, HTTPException
from sqlmodel import Session, select
from typing import List
from database.database import engine
from models.review import Review
from models.user import User
from models.movie import Movie
from schemas.review import ReviewCreate, ReviewRead, UserInReview, MovieInReview

router = APIRouter(prefix="/reviews", tags=["reviews"])

# GET svi reviewi za film
@router.get("/movie/{movie_id}", response_model=List[ReviewRead])
def get_reviews_for_movie(movie_id: int):
    with Session(engine) as session:
        statement = select(Review).where(Review.movie_id == movie_id)
        reviews = session.exec(statement).all()

        results = []
        for review in reviews:
            results.append(
                ReviewRead(
                    id=review.id,
                    rating=review.rating,
                    review_text=review.review_text,
                    review_date=review.review_date,
                    user=UserInReview(id=review.user.id, username=review.user.username) if review.user else None,
                    movie=MovieInReview(id=review.movie.id, title=review.movie.title) if review.movie else None,
                )
            )
        return results

# POST novi review
@router.post("/", response_model=ReviewRead)
def create_review(review: ReviewCreate):
    # TODO: proveri da li je user ulogovan (nije guest)
    # TODO: dozvoli samo ako je role == "user" ili "admin" ili "superadmin"

    with Session(engine) as session:
        movie = session.get(Movie, review.movie_id)
        if not movie:
            raise HTTPException(status_code=404, detail="Movie not found")

        user = session.get(User, review.user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")

        new_review = Review(
            rating=review.rating,
            review_text=review.review_text,
            user_id=review.user_id,
            movie_id=review.movie_id,
        )
        session.add(new_review)
        session.commit()
        session.refresh(new_review)

        return ReviewRead(
            id=new_review.id,
            rating=new_review.rating,
            review_text=new_review.review_text,
            review_date=new_review.review_date,
            user=UserInReview(id=user.id, username=user.username),
            movie=MovieInReview(id=movie.id, title=movie.title),
        )

# DELETE review
@router.delete("/{review_id}")
def delete_review(review_id: int, user_id: int):
    # TODO: proveri da li je user ulogovan
    # TODO: dozvoli samo ako je role == "admin" ili "superadmin"

    with Session(engine) as session:
        review = session.get(Review, review_id)
        if not review:
            raise HTTPException(status_code=404, detail="Review not found")

        session.delete(review)
        session.commit()
        return {"message": "Review deleted"}

