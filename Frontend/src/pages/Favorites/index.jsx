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
  TextField,
  InputAdornment,
  Chip,
} from "@mui/material";
import { Search, Favorite, FavoriteBorder } from "@mui/icons-material";
import { useThemeContext } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import MovieCard from "../../components/MovieCard";
import apiService from "../../services/apiService";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(6);
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

  // Filter favorites based on search query with error handling
  const filteredFavorites = Array.isArray(favorites) ? favorites.filter(movie => {
    try {
      if (!movie || !searchQuery) {
        return true;
      }
      
      const query = searchQuery.toLowerCase();
      const title = movie.title ? movie.title.toString().toLowerCase() : '';
      const director = movie.director ? movie.director.toString().toLowerCase() : '';
      const genre = movie.genre ? movie.genre.toString().toLowerCase() : '';
      
      return title.includes(query) || director.includes(query) || genre.includes(query);
    } catch (error) {
      console.error('Error filtering favorite movie:', error, movie);
      return false; // Skip this movie if there's an error
    }
  }) : [];

  // Handle load more
  const handleLoadMore = () => setVisibleCount(prev => prev + 6);

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

  const textColor = theme.palette.mode === 'dark' ? theme.palette.common.white : theme.palette.common.black;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        px: 2,
        py: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      <Typography
        variant="h2"
        sx={{ textAlign: "center", color: textColor, mb: 2 }}
      >
        My Favorites
      </Typography>

      {/* Search Bar */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <TextField
          variant="outlined"
          placeholder="Search your favorite movies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{
            width: { xs: "100%", sm: "400px", md: "500px" },
            "& .MuiOutlinedInput-root": {
              borderRadius: 3,
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Stats */}
      {Array.isArray(favorites) && favorites.length > 0 && (
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Chip
            label={`${filteredFavorites.length} of ${favorites.length} movie${favorites.length !== 1 ? 's' : ''}`}
            color="primary"
            variant="outlined"
            sx={{ fontSize: "16px", fontWeight: "bold" }}
          />
        </Box>
      )}

      {/* Empty State */}
      {!Array.isArray(favorites) || favorites.length === 0 ? (
        <Paper
          elevation={2}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            alignSelf: "center",
            maxWidth: "600px",
            width: "100%",
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
      ) : filteredFavorites.length === 0 ? (
        <Paper
          elevation={2}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 3,
            alignSelf: "center",
            maxWidth: "600px",
            width: "100%",
          }}
        >
          <Search sx={{ fontSize: 80, color: "text.secondary", mb: 2 }} />
          <Typography variant="h5" color="text.secondary" gutterBottom>
            No movies found
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Try adjusting your search query to find your favorite movies.
          </Typography>
          <Button
            variant="outlined"
            onClick={() => setSearchQuery("")}
            sx={{ borderRadius: 2 }}
          >
            Clear Search
          </Button>
        </Paper>
      ) : (
        <>
          {/* Movies Grid */}
          <Box
            sx={{
              display: "grid",
              gap: 3,
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "repeat(3, 1fr)",
              },
            }}
          >
            {filteredFavorites.slice(0, visibleCount).map((movie) => (
              <Box
                key={movie.id}
                onClick={() => {
                  const slug = movie.slug || movie.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
                  navigate(`/movie/${slug}`);
                }}
                sx={{ cursor: "pointer", height: "100%" }}
              >
                <MovieCard movie={movie} />
              </Box>
            ))}
          </Box>

          {/* Load More Button */}
          {visibleCount < filteredFavorites.length && (
            <Button
              variant="contained"
              onClick={handleLoadMore}
              sx={{
                mt: 3,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontWeight: "bold",
                fontSize: 20,
                "&:hover": { 
                  backgroundColor: theme.palette.primary.dark,
                },
                alignSelf: "center",
              }}
            >
              Load More
            </Button>
          )}
        </>
      )}
    </Box>
  );
}

export default Favorites;