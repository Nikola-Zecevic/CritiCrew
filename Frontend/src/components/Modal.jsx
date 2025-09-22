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

function Modal({ isOpen, onClose, movie }) {
  if (!movie) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#1a1a1a",
          border: "2px solid #f5c518",
          borderRadius: "12px",
          maxWidth: "900px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          animation: "modalSlideIn 0.3s ease-out",
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: "rgba(0,0,0,0.9)",
          backdropFilter: "blur(2px)",
        },
      }}
    >
      {/* Close button */}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          top: "1.2rem",
          left: "1.2rem",
          bgcolor: "#f5c518",
          color: "#000",
          borderRadius: "50%",
          width: 40,
          height: 40,
          fontSize: "1.2rem",
          fontWeight: "bold",
          zIndex: 10,
          "&:hover": {
            bgcolor: "#ffdf5e",
            transform: "scale(1.1)",
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Header */}
      <DialogTitle
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
      <DialogContent
        sx={{
          p: { xs: "1rem", md: "2rem" },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "300px 1fr" },
          gap: "2rem",
          alignItems: "flex-start",
          textAlign: { xs: "center", md: "left" },
        }}
      >
        {/* Poster */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            component="img"
            src={movie.image}
            alt={movie.title}
            sx={{
              width: "100%",
              maxWidth: { xs: 200, md: 280 },
              height: "auto",
              borderRadius: "8px",
              boxShadow: "0 8px 25px rgba(0,0,0,0.5)",
              mt: { xs: 0, md: 2 },
            }}
          />
        </Box>

        {/* Details */}
        <Box sx={{ color: "#ccc", mt: 0 }}>
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

          <Box>
            <Box
              sx={{
                mb: 0.5,
                p: 0.5,
                background: "#2a2a2a",
                borderRadius: "4px",
              }}
            >
              <strong style={{ color: "#f5c518" }}>Genre:</strong>{" "}
              {movie.genre || "Drama"}
            </Box>
            <Box
              sx={{
                mb: 0.5,
                p: 0.5,
                background: "#2a2a2a",
                borderRadius: "4px",
              }}
            >
              <strong style={{ color: "#f5c518" }}>Duration:</strong>{" "}
              {movie.duration || "142 min"}
            </Box>
            <Box
              sx={{
                mb: 0.5,
                p: 0.5,
                background: "#2a2a2a",
                borderRadius: "4px",
              }}
            >
              <strong style={{ color: "#f5c518" }}>Director:</strong>{" "}
              {movie.director || "Frank Darabont"}
            </Box>
          </Box>

          <Box
            sx={{
              pt: 0.5,
              borderTop: "2.5px solid #f5c518",
              mt: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#f5c518",
                fontWeight: "bold",
                fontSize: "1.5rem",
                mt: 1.5,
                mb: 1.2,
              }}
            >
              User Reviews
            </Typography>
            <UserReviews movieId={movie.id} />
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default Modal;
