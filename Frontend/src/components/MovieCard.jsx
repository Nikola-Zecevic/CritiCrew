import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
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

  // Load favorite status when component mounts or movie changes
  useEffect(() => {
    const loadFavoriteStatus = async () => {
      if (isAuthenticated) {
        try {
          const response = await apiService.checkFavoriteStatus(movie.id);
          setIsFavorited(response.is_favorite);
        } catch (error) {
          console.error('Failed to load favorite status:', error);
          // Fallback to localStorage for backwards compatibility
          const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
          setIsFavorited(favorites.includes(movie.id));
        }
      } else {
        // Not authenticated, use localStorage
        const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
        setIsFavorited(favorites.includes(movie.id));
      }
    };
    
    loadFavoriteStatus();
  }, [movie.id, isAuthenticated]);

  // Listen for all favorites cleared event
  useEffect(() => {
    const handleAllFavoritesCleared = () => {
      setIsFavorited(false);
    };

    window.addEventListener('allFavoritesCleared', handleAllFavoritesCleared);

    return () => {
      window.removeEventListener('allFavoritesCleared', handleAllFavoritesCleared);
    };
  }, []);

  const handleFavoriteToggle = async (e) => {
    e.stopPropagation(); // stop triggering parent click
    
    if (!isAuthenticated) {
      // If not authenticated, use localStorage as fallback
      try {
        const favorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
        let updatedFavorites;

        if (isFavorited) {
          updatedFavorites = favorites.filter(id => id !== movie.id);
          setIsFavorited(false);
        } else {
          updatedFavorites = [...favorites, movie.id];
          setIsFavorited(true);
        }

        localStorage.setItem('movieFavorites', JSON.stringify(updatedFavorites));
        
        // Dispatch custom event to notify other components of favorites change
        window.dispatchEvent(new CustomEvent('favoritesChanged', { 
          detail: { movieId: movie.id, isFavorited: !isFavorited } 
        }));
        
        setFavoriteSnackbarOpen(true);
      } catch (error) {
        console.error('Error toggling favorite in localStorage:', error);
      }
      return;
    }

    // Authenticated user - use backend API
    try {
      if (isFavorited) {
        // Remove from favorites
        await apiService.removeFromFavorites(movie.id);
        setIsFavorited(false);
      } else {
        // Add to favorites
        await apiService.addToFavorites(movie.id);
        setIsFavorited(true);
      }
      
      // Dispatch custom event to notify other components of favorites change
      window.dispatchEvent(new CustomEvent('favoritesChanged', { 
        detail: { movieId: movie.id, isFavorited: !isFavorited } 
      }));
      
      setFavoriteSnackbarOpen(true);
    } catch (error) {
      console.error('Error toggling favorite via API:', error);
      
      // Show error message to user
      if (error.message.includes('already in favorites')) {
        // Already favorited, just update UI
        setIsFavorited(true);
      } else if (error.message.includes('not found')) {
        // Favorite not found, just update UI
        setIsFavorited(false);
      }
    }
  };

  const handleCloseFavoriteSnackbar = () => {
    setFavoriteSnackbarOpen(false);
  };
  return (
    <Card
      sx={{
        position: "relative",
        display: isFeatured && !isSmallScreen ? "flex" : "flex",
        flexDirection: isFeatured && !isSmallScreen ? "row" : "column",
        height: isFeatured && !isSmallScreen ? "auto" : 420, // Slightly increased height for better spacing
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 3,
        backgroundColor: theme.palette.background.paper,
        cursor: "pointer", // Add cursor pointer to indicate clickable card
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: 4,
        },
        "&:hover .favorite-btn": {
          opacity: 1,
        },
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
          minHeight: 0, // Allow flex shrinking
        }}
      >
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
            minHeight: isFeatured ? "auto" : "2.4em", // Reserve space for 2 lines
          }}
        >
          {movie.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          Year: {movie.year}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.secondary.main }}
        >
          ⭐{" "}
          {getDisplayRating(movie) === "No reviews"
            ? "No reviews"
            : `${getDisplayRating(movie)}/5`}
        </Typography>
        {isFeatured && (
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.primary, mt: 1 }}
          >
            {movie.description}
          </Typography>
        )}
        {!isFeatured && (
          <Typography
            variant="body2"
            sx={{ 
              color: theme.palette.text.primary,
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: 1.3,
              mt: "auto", // Push genres to bottom of available space
            }}
          >
            {movie.genre}
          </Typography>
        )}
      </CardContent>
      
      {/* Favorite notification snackbar */}
      <Snackbar
        open={favoriteSnackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseFavoriteSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseFavoriteSnackbar} severity="success" sx={{ width: '100%' }}>
          {isFavorited ? 'Added to favorites!' : 'Removed from favorites!'}
        </Alert>
      </Snackbar>
    </Card>
  );
}