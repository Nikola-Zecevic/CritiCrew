import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Container,
  Grid,
  Chip,
} from "@mui/material";
import { useThemeContext } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import MovieCard from "../../components/MovieCard";
import apiService from "../../services/apiService";
import { Favorite, FavoriteBorder } from "@mui/icons-material";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clearing, setClearing] = useState(false);
  const { theme } = useThemeContext();
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Load user's favorite movies
  useEffect(() => {
    const loadFavorites = async () => {
      // Check if user is authenticated
      if (!isAuthenticated) {
        // For non-authenticated users, try to load from localStorage
        try {
          setLoading(true);
          setError(null);
          console.log("Loading favorites from localStorage for non-authenticated user");
          
          const localFavorites = JSON.parse(localStorage.getItem('movieFavorites') || '[]');
          console.log("Local favorites IDs:", localFavorites);
          
          if (localFavorites.length > 0) {
            // We need to fetch movie details for these IDs
            // For now, show a message that they need to log in to see full favorites
            setFavorites([]);
            setError("Please log in to view and manage your favorites. Some favorites may be stored locally but require authentication to display.");
          } else {
            setFavorites([]);
            setError("Please log in to view your favorites");
          }
        } catch (error) {
          console.error("Error loading local favorites:", error);
          setError("Please log in to view your favorites");
        }
        setLoading(false);
        return;
      }

      // Check if token exists in localStorage
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("🔍 Favorites Debug Info:", {
          currentUser,
          isAuthenticated,
          hasToken: !!token,
          tokenPreview: token ? `${token.substring(0, 20)}...` : 'No token'
        });
        
        const favoritesData = await apiService.getUserFavorites();
        console.log("Loaded favorites:", favoritesData);
        console.log("Favorites data type:", typeof favoritesData, "isArray:", Array.isArray(favoritesData));
        
        // Ensure favorites is always an array
        let favoritesArray = [];
        if (Array.isArray(favoritesData)) {
          favoritesArray = favoritesData;
        } else if (favoritesData && favoritesData.favorites && Array.isArray(favoritesData.favorites)) {
          favoritesArray = favoritesData.favorites;
        } else if (favoritesData && typeof favoritesData === 'object') {
          // If it's an object, try to extract array from common property names
          favoritesArray = favoritesData.data || favoritesData.results || favoritesData.movies || [];
        }
        
        console.log("Final favorites array:", favoritesArray);
        setFavorites(favoritesArray);
      } catch (error) {
        console.error("Error loading favorites:", error);
        
        // Handle specific 401 authentication errors
        if (error.message.includes('401')) {
          setError("Authentication expired. Please log in again.");
          // Optionally redirect to login page
          // navigate('/auth');
        } else {
          setError(error.message || "Failed to load favorites");
        }
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, [isAuthenticated, currentUser]);

  // Helper function to refresh favorites (used as fallback)
  const refreshFavorites = async () => {
    if (!isAuthenticated) {
      return;
    }
    
    try {
      const favoritesData = await apiService.getUserFavorites();
      
      // Ensure favorites is always an array
      let favoritesArray = [];
      if (Array.isArray(favoritesData)) {
        favoritesArray = favoritesData;
      } else if (favoritesData && favoritesData.favorites && Array.isArray(favoritesData.favorites)) {
        favoritesArray = favoritesData.favorites;
      } else if (favoritesData && typeof favoritesData === 'object') {
        favoritesArray = favoritesData.data || favoritesData.results || favoritesData.movies || [];
      }
      
      setFavorites(favoritesArray);
    } catch (error) {
      console.error("Error refreshing favorites:", error);
    }
  };

  // Listen for storage changes (for localStorage fallback) and custom events
  useEffect(() => {
    const handleStorageChange = () => {
      // Only refresh if not authenticated (using localStorage)
      if (!isAuthenticated) {
        refreshFavorites();
      }
    };

    const handleFavoritesChange = async (event) => {
      if (!isAuthenticated) {
        return;
      }

      const { movieId, isFavorited } = event.detail || {};
      console.log('🔄 Favorites change detected:', { movieId, isFavorited });

      if (isFavorited) {
        // Movie was added to favorites - fetch the movie details and add to list
        try {
          // Get all movies to find the one that was favorited
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://criticrew-1.onrender.com'}/movies/`);
          const moviesData = await response.json();
          const movies = Array.isArray(moviesData) ? moviesData : (moviesData.movies || []);
          const addedMovie = movies.find(movie => movie.id === movieId);
          
          if (addedMovie) {
            setFavorites(prev => {
              // Check if movie is already in favorites to prevent duplicates
              if (prev.some(fav => fav.id === movieId)) {
                return prev;
              }
              console.log('✅ Added movie to favorites list:', addedMovie.title);
              return [...prev, addedMovie];
            });
          }
        } catch (error) {
          console.error('Error fetching movie details:', error);
          // Fallback to full refresh if we can't get movie details
          refreshFavorites();
        }
      } else {
        // Movie was removed from favorites - remove from list
        setFavorites(prev => {
          const filtered = prev.filter(movie => movie.id !== movieId);
          console.log('❌ Removed movie from favorites list');
          return filtered;
        });
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('favoritesChanged', handleFavoritesChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('favoritesChanged', handleFavoritesChange);
    };
  }, [isAuthenticated]);

  // Handle clearing all favorites
  const handleClearAllFavorites = async () => {
    if (!window.confirm("Are you sure you want to remove all movies from your favorites?")) {
      return;
    }

    try {
      setClearing(true);
      await apiService.clearAllFavorites();
      setFavorites([]);
      
      // Dispatch event to notify other components that all favorites were cleared
      window.dispatchEvent(new CustomEvent('allFavoritesCleared'));
      
    } catch (error) {
      console.error("Error clearing favorites:", error);
      setError("Failed to clear favorites");
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        {(error.includes("log in") || error.includes("Authentication")) && (
          <Box textAlign="center" sx={{ mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/auth')}
              sx={{ borderRadius: 2 }}
            >
              Go to Login
            </Button>
          </Box>
        )}
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header Section */}
      <Paper
        elevation={3}
        sx={{
          p: 4,
          mb: 4,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}20, ${theme.palette.secondary.main}20)`,
          borderRadius: 3,
        }}
      >
        <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Favorite color="primary" sx={{ fontSize: 40 }} />
            <Box>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: "bold",
                  color: theme.palette.primary.main,
                  mb: 1,
                }}
              >
                My Favorites
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Your personally curated collection of favorite movies
              </Typography>
            </Box>
          </Box>
          
          {Array.isArray(favorites) && favorites.length > 0 && (
            <Box display="flex" alignItems="center" gap={2}>
              <Chip
                label={`${favorites.length} movie${favorites.length !== 1 ? 's' : ''}`}
                color="primary"
                variant="outlined"
              />
              <Button
                variant="outlined"
                color="error"
                onClick={handleClearAllFavorites}
                disabled={clearing}
                size="small"
              >
                {clearing ? "Clearing..." : "Clear All"}
              </Button>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Movies Grid */}
      {!Array.isArray(favorites) || favorites.length === 0 ? (
        <Paper
          elevation={2}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
          }}
        >
          <FavoriteBorder sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No favorites yet
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Start exploring movies and add them to your favorites to see them here!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/movies')}
            sx={{ borderRadius: 2 }}
          >
            Browse Movies
          </Button>
        </Paper>
      ) : (
        <>
          <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 600 }}>
            Your Collection ({Array.isArray(favorites) ? favorites.length : 0} movie{Array.isArray(favorites) && favorites.length !== 1 ? 's' : ''})
          </Typography>
          
          <Grid container spacing={3}>
            {Array.isArray(favorites) && favorites.map((movie) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                <MovieCard
                  movie={movie}
                />
              </Grid>
            ))}
          </Grid>
          
          
          {!Array.isArray(favorites) && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Error: Favorites data is not in the expected format. Please refresh the page.
            </Alert>
          )}
        </>
      )}
    </Container>
  );
}

export default Favorites;