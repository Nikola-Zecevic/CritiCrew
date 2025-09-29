import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import UserReviews from "./UserReviews";
import { useThemeContext } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import moviesService from "../services/moviesService";
import apiService from "../services/apiService";
import { getDisplayRating } from "../utils/ratingUtils";

function Modal({ isOpen, onClose, movie }) {
  const { theme } = useThemeContext();
  const { isAuthenticated } = useAuth();
  const [currentRating, setCurrentRating] = useState(movie?.rating || 0);
  const [isUserRating, setIsUserRating] = useState(
    movie?.isUserRating || false
  );
  const [shareSnackbarOpen, setShareSnackbarOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteSnackbarOpen, setFavoriteSnackbarOpen] = useState(false);
  const [favoriteMessage, setFavoriteMessage] = useState("");
  const [favoriteSeverity, setFavoriteSeverity] = useState("success");

  useEffect(() => {
    if (movie) {
      setCurrentRating(movie.rating);
      setIsUserRating(movie.isUserRating || false);

      const loadFavoriteStatus = async () => {
        if (isAuthenticated) {
          try {
            const response = await apiService.checkFavoriteStatus(movie.id);
            setIsFavorite(response.is_favorite);
          } catch {
            const favorites = JSON.parse(
              localStorage.getItem("movieFavorites") || "[]"
            );
            setIsFavorite(favorites.includes(movie.id));
          }
        } else {
          const favorites = JSON.parse(
            localStorage.getItem("movieFavorites") || "[]"
          );
          setIsFavorite(favorites.includes(movie.id));
        }
      };

      loadFavoriteStatus();
    }
  }, [movie, isAuthenticated]);

  const updateMovieRating = (reviews) => {
    let newRating = movie.rating;
    let isFromUserReviews = false;

    if (reviews && reviews.length > 0) {
      const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
      newRating = sum / reviews.length;
      isFromUserReviews = true;
    }

    setCurrentRating(newRating);
    setIsUserRating(isFromUserReviews);
    moviesService.updateMovieRating(movie.id, newRating);
  };

  const handleShare = async () => {
    try {
      const movieUrl = `${window.location.origin}/movie/${movie.slug}`;
      if (navigator.share) {
        await navigator.share({
          title: movie.title,
          text: `Check out this movie: ${movie.title}`,
          url: movieUrl,
        });
      } else {
        await navigator.clipboard.writeText(movieUrl);
        setShareSnackbarOpen(true);
      }
    } catch {
      try {
        await navigator.clipboard.writeText(
          `${window.location.origin}/movie/${movie.slug}`
        );
        setShareSnackbarOpen(true);
      } catch {
        alert(
          `Copy this link to share: ${window.location.origin}/movie/${movie.slug}`
        );
      }
    }
  };

  const handleCloseSnackbar = () => setShareSnackbarOpen(false);
  const handleCloseFavoriteSnackbar = () => setFavoriteSnackbarOpen(false);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      setFavoriteMessage("Log in to add favorites");
      setFavoriteSeverity("error");
      setFavoriteSnackbarOpen(true);
      setIsFavorite(false);
      return;
    }

    try {
      if (isFavorite) {
        await apiService.removeFromFavorites(movie.id);
        setIsFavorite(false);
        setFavoriteMessage(`${movie.title} removed from favorites!`);
      } else {
        await apiService.addToFavorites(movie.id);
        setIsFavorite(true);
        setFavoriteMessage(`${movie.title} added to favorites!`);
      }

      setFavoriteSeverity("success");
      setFavoriteSnackbarOpen(true);

      window.dispatchEvent(
        new CustomEvent("favoritesChanged", {
          detail: { movieId: movie.id, isFavorited: !isFavorite },
        })
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      if (error.message.includes("already in favorites")) setIsFavorite(true);
      else if (error.message.includes("not found")) setIsFavorite(false);
    }
  };

  if (!movie) return null;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { bgcolor: theme.palette.background.default, borderRadius: 3 },
      }}
      aria-labelledby="movie-dialog-title"
    >
      {/* Close button */}
      <IconButton
        aria-label="close"
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 16,
          left: 16,
          bgcolor: theme.palette.primary.main,
          color: theme.palette.mode === "dark" ? "#000" : "#fff",
          borderRadius: "50%",
          width: 40,
          height: 40,
          zIndex: 10,
          "&:hover": { bgcolor: theme.palette.secondary.main },
        }}
      >
        <CloseIcon />
      </IconButton>

      {/* Favorite button */}
      <IconButton
        aria-label={isFavorite ? "remove from favorites" : "add to favorites"}
        onClick={handleFavoriteToggle}
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          bgcolor: isFavorite
            ? theme.palette.error.main
            : theme.palette.primary.main,
          color: theme.palette.mode === "dark" ? "#000" : "#fff",
          borderRadius: "50%",
          width: 40,
          height: 40,
          zIndex: 10,
          "&:hover": {
            bgcolor: isFavorite
              ? theme.palette.error.dark
              : theme.palette.secondary.main,
          },
        }}
      >
        {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
      </IconButton>

      {/* Share button */}
      <IconButton
        aria-label="share movie"
        onClick={handleShare}
        sx={{
          position: "absolute",
          top: 72,
          right: 16,
          bgcolor: theme.palette.primary.main,
          color: theme.palette.mode === "dark" ? "#000" : "#fff",
          borderRadius: "50%",
          width: 40,
          height: 40,
          "&:hover": { bgcolor: theme.palette.secondary.main },
        }}
      >
        <ShareIcon />
      </IconButton>

      {/* Header */}
      <DialogTitle id="movie-dialog-title" sx={{ textAlign: "center", pb: 1 }}>
        <Typography
          variant="h4"
          sx={{ color: theme.palette.primary.main, fontWeight: "bold" }}
        >
          {movie.title}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{ color: theme.palette.text.secondary }}
        >
          {movie.year}
        </Typography>
        <Box
          sx={{
            mt: 1,
            display: "inline-block",
            px: 2,
            py: 1,
            borderRadius: 2.5,
            bgcolor:
              theme.palette.mode === "dark"
                ? "rgba(245,197,24,0.18)"
                : "rgba(0,0,0,0.05)",
          }}
        >
          ★{" "}
          {getDisplayRating({ rating: currentRating, isUserRating }) ===
          "No reviews"
            ? "No reviews"
            : `${getDisplayRating({ rating: currentRating, isUserRating })}/5`}
        </Box>
      </DialogTitle>

      {/* Body */}
      <DialogContent
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "300px 1fr" },
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Box
            component="img"
            src={movie.image}
            alt={movie.title}
            sx={{
              width: "100%",
              maxWidth: { xs: 200, md: 280 },
              borderRadius: 2,
              mt: 2,
            }}
          />
        </Box>
        <Box sx={{ color: theme.palette.text.primary }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: theme.palette.primary.main,
              mt: 3,
            }}
          >
            Description
          </Typography>
          <Typography
            sx={{ color: theme.palette.text.secondary, mt: 1, mb: 3.5 }}
          >
            {movie.description || "No description available."}
          </Typography>

          <Box>
            {[
              ["Genre", movie.genre || "Drama"],
              ["Director", movie.director || "Frank Darabont"],
            ].map(([label, value]) => (
              <Box
                key={label}
                sx={{
                  mb: 0.5,
                  p: 0.5,
                  bgcolor: theme.palette.background.paper,
                  borderRadius: 1,
                }}
              >
                <strong style={{ color: theme.palette.primary.main }}>
                  {label}:
                </strong>{" "}
                {value}
              </Box>
            ))}
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
                fontWeight: "bold",
                color: theme.palette.primary.main,
                mt: 1.5,
              }}
            >
              User Reviews
            </Typography>
            <UserReviews
              movieId={movie.id}
              onReviewsChange={updateMovieRating}
            />
          </Box>
        </Box>
      </DialogContent>

      {/* Share Snackbar */}
      <Snackbar
        open={shareSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Movie link copied to clipboard!
        </Alert>
      </Snackbar>

      {/* Favorite Snackbar */}
      <Snackbar
        open={favoriteSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseFavoriteSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseFavoriteSnackbar}
          severity={favoriteSeverity}
          sx={{ width: "100%" }}
        >
          {favoriteMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}

export default Modal;
