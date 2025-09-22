import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import UserReviews from "./UserReviews";

function Modal({ isOpen, onClose, movie }) {
  const theme = useTheme();
  if (!movie) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: theme.palette.background.default,
          border: `2px solid ${theme.palette.primary.main}`,
          borderRadius: 3,
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
          backgroundColor:
            theme.palette.mode === "dark"
              ? "rgba(0,0,0,0.9)"
              : "rgba(0,0,0,0.5)",
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
          bgcolor: theme.palette.primary.main,
          color: theme.palette.getContrastText(theme.palette.primary.main),
          borderRadius: "50%",
          width: 40,
          height: 40,
          fontSize: "1.2rem",
          fontWeight: "bold",
          zIndex: 10,
          "&:hover": {
            bgcolor: theme.palette.primary.light,
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
          borderBottom: `1px solid ${theme.palette.divider}`,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          component="h2"
          sx={{
            fontSize: { xs: "2rem", md: "2.5rem" },
            fontWeight: 700,
            color: theme.palette.primary.main,
            mb: 0.5,
            letterSpacing: 0.5,
          }}
        >
          {movie.title}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: theme.palette.text.secondary,
            fontSize: "1.1rem",
            mb: 0.5,
          }}
        >
          {movie.year}
        </Typography>
        <Box
          sx={{
            display: "inline-block",
            color: theme.palette.primary.main,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(245, 197, 24, 0.2)"
                : theme.palette.action.hover,
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
              borderRadius: 2,
              boxShadow: theme.shadows[6],
              mt: { xs: 0, md: 2 },
            }}
          />
        </Box>

        {/* Details */}
        <Box sx={{ color: theme.palette.text.secondary, mt: 0 }}>
          <Typography
            variant="h6"
            sx={{
              color: theme.palette.primary.main,
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
              color: theme.palette.text.secondary,
            }}
          >
            {movie.description || "No description available."}
          </Typography>

          <Box>
            <Box
              sx={{
                mb: 0.5,
                p: 0.5,
                bgcolor: theme.palette.background.paper,
                borderRadius: 1,
              }}
            >
              <strong style={{ color: theme.palette.primary.main }}>
                Genre:
              </strong>{" "}
              {movie.genre || "Drama"}
            </Box>
            <Box
              sx={{
                mb: 0.5,
                p: 0.5,
                bgcolor: theme.palette.background.paper,
                borderRadius: 1,
              }}
            >
              <strong style={{ color: theme.palette.primary.main }}>
                Duration:
              </strong>{" "}
              {movie.duration || "142 min"}
            </Box>
            <Box
              sx={{
                mb: 0.5,
                p: 0.5,
                bgcolor: theme.palette.background.paper,
                borderRadius: 1,
              }}
            >
              <strong style={{ color: theme.palette.primary.main }}>
                Director:
              </strong>{" "}
              {movie.director || "Frank Darabont"}
            </Box>
          </Box>

          <Box
            sx={{
              pt: 0.5,
              borderTop: `2.5px solid ${theme.palette.primary.main}`,
              mt: 2,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.primary.main,
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
