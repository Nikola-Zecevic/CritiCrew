import React from "react";
import "../styles/Modal.css";
import UserReviews from "./UserReviews";

function Modal({ isOpen, onClose, movie }) {
  if (!isOpen) return null;

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          ✕
        </button>

        <div className="modal-header">
          <h2 className="modal-title">{movie?.title}</h2>
          <p className="modal-year">{movie?.year}</p>
          <div className="modal-rating">⭐ {movie?.rating}/10</div>
        </div>

        <div className="modal-body">
          <div className="modal-image">
            <img
              src={movie?.image}
              alt={movie?.title}
              className="modal-poster"
            />
          </div>

          <div className="modal-details">
            <h3>Description</h3>
            <p className="modal-description">
              {movie?.description || "No description available."}
            </p>

            <div className="modal-info">
              <div className="info-item">
                <strong>Genre:</strong> {movie?.genre || "Drama"}
              </div>
              <div className="info-item">
                <strong>Duration:</strong> {movie?.duration || "142 min"}
              </div>
              <div className="info-item">
                <strong>Director:</strong> {movie?.director || "Frank Darabont"}
              </div>
            </div>

            <div className="modal-reviews">
              <h3>User Reviews</h3>
              <UserReviews movieId={movie?.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
