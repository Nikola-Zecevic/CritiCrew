import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
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
        className: "modal-content", // layout + animation in CSS
        sx: {
          bgcolor: "background.paper", // theme-aware
          border: "2px solid #f5c518",
        },
      }}
      BackdropProps={{
        className: "modal-overlay",
      }}
    >
      {/* Close button */}
      <IconButton aria-label="close" onClick={onClose} className="modal-close">
        <CloseIcon />
      </IconButton>

      {/* Header */}
      <DialogTitle className="modal-header">
        <Typography
          variant="h4"
          component="h2"
          className="modal-title"
          sx={{
            fontSize: { xs: "2rem", md: "2.5rem" }, // responsive via sx
          }}
        >
          {movie.title}
        </Typography>
        <Typography variant="subtitle1" className="modal-year">
          {movie.year}
        </Typography>
        <Box className="modal-rating">★ {movie.rating}/10</Box>
      </DialogTitle>

      {/* Body */}
      <DialogContent className="modal-body">
        {/* Poster */}
        <Box className="modal-image">
          <img src={movie.image} alt={movie.title} className="modal-poster" />
        </Box>

        {/* Details */}
        <Box className="modal-details">
          <Typography variant="h6" className="section-title">
            Description
          </Typography>
          <Typography className="modal-description">
            {movie.description || "No description available."}
          </Typography>

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
            <Typography variant="h6" className="section-title">
              User Reviews
            </Typography>
            <UserReviews movieId={movie.id} />
          </div>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
