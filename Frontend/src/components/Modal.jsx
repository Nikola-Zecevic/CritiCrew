import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UserReviews from "./UserReviews";
import "../styles/Modal.css";

function Modal({ isOpen, onClose, movie }) {
  if (!movie) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        className: "modal-content",
      }}
      BackdropProps={{
        className: "modal-overlay",
      }}
    >
      {/* Close button */}
      <IconButton aria-label="close" className="modal-close" onClick={onClose}>
        <CloseIcon />
      </IconButton>

      {/* Header */}
      <DialogTitle className="modal-header">
        <Typography variant="h4" component="h2" className="modal-title">
          {movie.title}
        </Typography>
        <Typography variant="subtitle1" className="modal-year">
          {movie.year}
        </Typography>
        <div className="modal-rating">⭐ {movie.rating}/10</div>
      </DialogTitle>

      {/* Body */}
      <DialogContent className="modal-body">
        <div className="modal-image">
          <img src={movie.image} alt={movie.title} className="modal-poster" />
        </div>

        <div className="modal-details">
          <h3>Description</h3>
          <p className="modal-description">
            {movie.description || "No description available."}
          </p>

          <div className="modal-info">
            <div className="info-item">
              <strong>Genre:</strong> {movie.genre || "Drama"}
            </div>
            <div className="info-item">
              <strong>Duration:</strong> {movie.duration || "142 min"}
            </div>
            <div className="info-item">
              <strong>Director:</strong> {movie.director || "Frank Darabont"}
            </div>
          </div>

          <div className="modal-reviews">
            <h3>User Reviews</h3>
            <UserReviews movieId={movie.id} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
