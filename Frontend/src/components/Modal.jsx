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
      slotProps={{
        paper: {
          className: "modal-content", // layout + animation in CSS
          sx: {
            bgcolor: "background.paper", // theme-aware
            border: "2px solid #f5c518",
          },
        },
        backdrop: {
          className: "modal-overlay",
        },
      }}
    >
      {/* Close button */}
      <IconButton aria-label="close" onClick={onClose} className="modal-close">
        <CloseIcon />
      </IconButton>

      {/* Header */}
      <DialogTitle
        className="modal-header"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.5,
          p: "2rem 2rem 1rem",
          borderBottom: "1px solid #333",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontSize: { xs: "2rem", md: "2.5rem" },
            fontWeight: 700,
            color: "#f5c518",
            mb: 0.5,
            letterSpacing: 0.5,
          }}
        >
          {movie.title}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#ccc",
            fontSize: "1.1rem",
            mb: 0.5,
          }}
        >
          {movie.year}
        </Typography>
        <Box
          sx={{
            display: "inline-block",
            color: "#f5c518",
            backgroundColor: "rgba(245, 197, 24, 0.2)",
            px: 2,
            py: 1,
            borderRadius: 2.5,
            fontWeight: "bold",
            fontSize: "1.1rem",
            mt: 0.5,
          }}
        >
          ★ {movie.rating}/10
        </Box>
      </DialogTitle>

      {/* Body */}
      <DialogContent className="modal-body">
        {/* Poster */}
        <Box className="modal-image">
          <img src={movie.image} alt={movie.title} className="modal-poster" />
        </Box>

        {/* Details */}
        <Box className="modal-details">
          <Typography
            variant="h6"
            sx={{
              color: "#f5c518",
              fontWeight: "bold",
              fontSize: "1.5rem",
              mt: 3,
              mb: 1.5,
            }}
          >
            Description
          </Typography>
          <Typography
            sx={{
              lineHeight: 1.6,
              fontSize: "1.1rem",
              mt: 1,
              mb: 3.5,
              color: "#ccc",
            }}
          >
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
            <Typography
              variant="h6"
              sx={{
                color: "#f5c518",
                fontWeight: "bold",
                fontSize: "1.5rem",
                mt: 1.5, // reduced from 3
                mb: 1.2, // slightly reduced
              }}
            >
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
