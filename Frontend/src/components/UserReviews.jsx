import React from "react";
import reviews from "../services/reviews";
import "../styles/UserReviews.css";

function UserReviews({ movieId }) {
  const movieReviews = reviews.filter((r) => r.movieId === movieId);

  if (movieReviews.length === 0) {
    return <p className="no-reviews">No user reviews yet.</p>;
  }

  return (
    <div className="reviews-list">
      {movieReviews.map((review, index) => (
        <div key={index} className="review-card">
          <div className="review-header">
            <span className="review-user">{review.user}</span>
            <span className="review-rating">
              {"⭐".repeat(review.rating)} ({review.rating}/5)
            </span>
          </div>
          <p className="review-comment">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}

export default UserReviews;
