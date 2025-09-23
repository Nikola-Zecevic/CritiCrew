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
import { useThemeContext } from "../contexts/ThemeContext";

function Modal({ isOpen, onClose, movie }) {
  const { mode } = useThemeContext();
  if (!movie) return null;

  // Define theme colors based on mode
  const colors = {
    dark: {
      background: "#0b0b0b",
      surface: "#121212",
      text: "#fff",
      secondaryText: "#aaa",
      primary: "#FFD700", // gold
      border: "#FFD700",
    },
    light: {
      background: "#fff",
      surface: "#f5f5f5",
      text: "#000",
      secondaryText: "#666",
      primary: "#000",
      border: "#000",
    },
  }[mode || "light"];

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: colors.background,
          border: `2px solid ${colors.border}`,
          borderRadius: 3,
          maxWidth: "900px",
          width: "90%",
          maxHeight: "90vh",
          overflowY: "auto",
          position: "relative",
          animation: "modalSlideIn 0.3s ease-out",

          /* custom scrollbar styling */
          "&::-webkit-scrollbar": {
            width: "10px",
            height: "10px",
          },
          "&::-webkit-scrollbar-track": {
            background: mode === "dark" ? "#0b0b0b" : "#f1f1f1",
            borderRadius: 8,
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: colors.primary,
            borderRadius: 8,
            border: `2px solid ${colors.background}`,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: mode === "dark" ? "#e6c200" : "#333",
          },

          scrollbarWidth: "thin",
          scrollbarColor: `${colors.primary} ${colors.background}`,
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor:
            mode === "dark" ? "rgba(0,0,0,0.9)" : "rgba(0,0,0,0.5)",
          backdropFilter: "blur(2px)",
        },
      }}
      aria-labelledby="movie-dialog-title"
    >
      {/* Close button */}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          top: "1.2rem",
          left: "1.2rem",
          bgcolor: colors.primary,
          color: mode === "dark" ? "#000" : "#fff",
          borderRadius: "50%",
          width: 40,
          height: 40,
          fontSize: "1.2rem",
          fontWeight: "bold",
          zIndex: 10,
          "&:hover": {
            bgcolor: mode === "dark" ? "#e6c200" : "#333",
            transform: "scale(1.1)",
          },
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Header */}
      <DialogTitle
        id="movie-dialog-title"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.5,
          p: "2rem 2rem 1rem",
          borderBottom: `1px solid ${colors.secondaryText}`,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          component="div"
          sx={{
            fontSize: { xs: "2rem", md: "2.5rem" },
            fontWeight: 700,
            color: colors.primary,
            mb: 0.5,
            letterSpacing: 0.5,
          }}
        >
          {movie.title}
        </Typography>

        <Typography
          variant="subtitle1"
          component="div"
          sx={{
            color: colors.secondaryText,
            fontSize: "1.1rem",
            mb: 0.5,
          }}
        >
          {movie.year}
        </Typography>

        <Box
          sx={{
            display: "inline-block",
            color: colors.primary,
            backgroundColor:
              mode === "dark" ? "rgba(245, 197, 24, 0.18)" : "rgba(0,0,0,0.05)",
            px: 2,
            py: 1,
            borderRadius: 2.5,
            fontWeight: "bold",
            fontSize: "1.1rem",
            mt: 0.5,
          }}
          aria-hidden
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
              borderRadius: 2,
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              mt: { xs: 0, md: 2 },
            }}
          />
        </Box>

        {/* Details */}
        <Box sx={{ color: colors.text, mt: 0 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              color: colors.primary,
              fontWeight: "bold",
              fontSize: "1.5rem",
              mt: 3,
              mb: 1.5,
            }}
          >
            Description
          </Typography>

          <Typography
            component="div"
            sx={{
              lineHeight: 1.6,
              fontSize: "1.1rem",
              mt: 1,
              mb: 3.5,
              color: colors.secondaryText,
            }}
          >
            {movie.description || "No description available."}
          </Typography>

          <Box>
            <Box
              sx={{
                mb: 0.5,
                p: 0.5,
                bgcolor: colors.surface,
                borderRadius: 1,
              }}
            >
              <strong style={{ color: colors.primary }}>Genre:</strong>{" "}
              {movie.genre || "Drama"}
            </Box>

            <Box
              sx={{
                mb: 0.5,
                p: 0.5,
                bgcolor: colors.surface,
                borderRadius: 1,
              }}
            >
              <strong style={{ color: colors.primary }}>Duration:</strong>{" "}
              {movie.duration || "142 min"}
            </Box>

            <Box
              sx={{
                mb: 0.5,
                p: 0.5,
                bgcolor: colors.surface,
                borderRadius: 1,
              }}
            >
              <strong style={{ color: colors.primary }}>Director:</strong>{" "}
              {movie.director || "Frank Darabont"}
            </Box>
          </Box>

          <Box
            sx={{
              pt: 0.5,
              borderTop: `2.5px solid ${colors.primary}`,
              mt: 2,
            }}
          >
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: colors.primary,
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
