import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  useMediaQuery,
  IconButton,
  Snackbar,
  Alert,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useThemeContext } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import apiService from "../services/apiService";
import { getDisplayRating } from "../utils/ratingUtils";

export default function MovieCard({ movie, isFeatured = false }) {
  const { theme } = useThemeContext();
  const { isAuthenticated } = useAuth();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteSnackbarOpen, setFavoriteSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [imdbRating, setImdbRating] = useState(null);

  useEffect(() => {
    const loadFavoriteStatus = async () => {
      if (isAuthenticated) {
        try {
          const response = await apiService.checkFavoriteStatus(movie.id);
          setIsFavorited(response.is_favorite);
        } catch {
          setIsFavorited(false);
        }
      } else {
        const favorites = JSON.parse(
          localStorage.getItem("movieFavorites") || "[]"
        );
        setIsFavorited(favorites.includes(movie.id));
      }
    };
    loadFavoriteStatus();
  }, [movie.id, isAuthenticated]);

  useEffect(() => {
    const fetchIMDb = async () => {
      if (movie?.title) {
        try {
          const omdbData = await apiService.getMovieFromOMDb(movie.title);
          if (omdbData?.imdbRating && omdbData.imdbRating !== "N/A") {
            setImdbRating(omdbData.imdbRating);
          }
        } catch {
          console.error("Failed to fetch IMDb rating");
        }
      }
    };
    fetchIMDb();
  }, [movie?.title]);

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      setSnackbarMessage("Log in to add favorites");
      setSnackbarSeverity("error");
      setFavoriteSnackbarOpen(true);
      setIsFavorited(false);
      return;
    }

    try {
      if (isFavorited) {
        await apiService.removeFromFavorites(movie.id);
        setIsFavorited(false);
        setSnackbarMessage("Removed from favorites!");
      } else {
        await apiService.addToFavorites(movie.id);
        setIsFavorited(true);
        setSnackbarMessage("Added to favorites!");
      }

      setSnackbarSeverity("success");
      setFavoriteSnackbarOpen(true);

      window.dispatchEvent(
        new CustomEvent("favoritesChanged", {
          detail: { movieId: movie.id, isFavorited: !isFavorited },
        })
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const handleCloseFavoriteSnackbar = () => setFavoriteSnackbarOpen(false);

  return (
    <Card
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: isFeatured && !isSmallScreen ? "row" : "column",
        height: "auto",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 3,
        backgroundColor: theme.palette.background.paper,
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": { transform: "translateY(-2px)", boxShadow: 4 },
        "&:hover .favorite-btn": { opacity: 1 },
      }}
    >
      {/* Favorite button */}
      <IconButton
        onClick={handleFavoriteToggle}
        className="favorite-btn"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow: 2,
          "&:hover": { backgroundColor: theme.palette.background.default },
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {isFavorited ? (
          <Favorite sx={{ color: theme.palette.error.main }} />
        ) : (
          <FavoriteBorder sx={{ color: theme.palette.text.primary }} />
        )}
      </IconButton>

      <CardMedia
        component="img"
        image={movie.image}
        alt={movie.title}
        sx={{
          width: isFeatured && !isSmallScreen ? "40%" : "100%",
          height: isFeatured && !isSmallScreen ? "auto" : 280,
          objectFit: "cover",
        }}
      />

      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: isFeatured ? "center" : "space-between",
          gap: 1,
          p: isFeatured ? 3 : 2,
        }}
      >
        {/* Movie title */}
        <Typography
          variant={isFeatured ? "h5" : "h6"}
          sx={{
            fontWeight: 600,
            color: theme.palette.text.primary,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: isFeatured ? 3 : 2,
            WebkitBoxOrient: "vertical",
            lineHeight: 1.2,
          }}
        >
          {movie.title}
        </Typography>

        {/* Genres */}
        {movie.genre && (
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            {movie.genre}
          </Typography>
        )}

        {/* Ratings */}
        <Typography
          variant="body2"
          sx={{ color: theme.palette.secondary.main }}
        >
          ⭐{" "}
          {getDisplayRating(movie) === "No reviews"
            ? "No reviews"
            : `${getDisplayRating(movie)}/5`}
        </Typography>
        {imdbRating && (
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.secondary }}
          >
            🎥 IMDb: {imdbRating}/10
          </Typography>
        )}

        {/* Description only in featured */}
        {isFeatured && (
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.primary, mt: 1 }}
          >
            {movie.description}
          </Typography>
        )}
      </CardContent>

      {/* Favorite notification snackbar */}
      <Snackbar
        open={favoriteSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseFavoriteSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseFavoriteSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Card>
  );
}
