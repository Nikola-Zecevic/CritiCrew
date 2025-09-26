import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moviesService from "../../services/moviesService";
import MovieCard from "../../components/MovieCard";
import {
  Box,
  Paper,
  Typography,
  Button,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useThemeContext } from "../../contexts/ThemeContext";

function Filter() {
  // Initialize state from sessionStorage or use defaults
  const [visibleCount, setVisibleCount] = useState(() => {
    const saved = sessionStorage.getItem('filter-visible-count');
    return saved ? parseInt(saved, 10) : 6;
  });
  const [selectedGenres, setSelectedGenres] = useState(() => {
    const saved = sessionStorage.getItem('filter-selected-genres');
    return saved ? JSON.parse(saved) : [];
  });
  const [showGenreBox, setShowGenreBox] = useState(() => {
    const saved = sessionStorage.getItem('filter-show-genre-box');
    return saved ? JSON.parse(saved) : false;
  });
  const [sortRating, setSortRating] = useState(() => {
    const saved = sessionStorage.getItem('filter-sort-rating');
    return saved || "";
  });
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { mode } = useThemeContext();

  // Load movies on component mount
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const movies = await moviesService.getAllMovies();
        setAllMovies(movies);
      } catch (err) {
        setError('Failed to load movies: ' + err.message);
        console.error('Error loading movies:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  // Save state changes to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('filter-visible-count', visibleCount.toString());
  }, [visibleCount]);

  useEffect(() => {
    sessionStorage.setItem('filter-selected-genres', JSON.stringify(selectedGenres));
  }, [selectedGenres]);

  useEffect(() => {
    sessionStorage.setItem('filter-show-genre-box', JSON.stringify(showGenreBox));
  }, [showGenreBox]);

  useEffect(() => {
    sessionStorage.setItem('filter-sort-rating', sortRating);
  }, [sortRating]);

  const handleLoadMore = () => setVisibleCount((prev) => prev + 3);
  const handleMovieClick = (movie) => navigate(`/movie/${movie.slug}`);

  const allGenres = Array.from(
    new Set(
      allMovies.flatMap((movie) => movie.genre.split(",").map((g) => g.trim()))
    )
  );

  const toggleGenre = (genre) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
    // Note: We no longer reset visibleCount to preserve "Load More" state
  };

  let filteredMovies =
    selectedGenres.length === 0
      ? allMovies
      : allMovies.filter((movie) =>
          selectedGenres.every((g) =>
            movie.genre.toLowerCase().includes(g.toLowerCase())
          )
        );

  if (sortRating === "asc") {
    filteredMovies = [...filteredMovies].sort((a, b) => a.rating - b.rating);
  } else if (sortRating === "desc") {
    filteredMovies = [...filteredMovies].sort((a, b) => b.rating - a.rating);
  }

  const bgPaper = mode === "light" ? "#fff" : "#121212";
  const textColor = mode === "light" ? "#333" : "#FFD700";
  const highlightColor = "#f5c518";

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "50vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: 2,
          py: 4,
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1200,
        mx: "auto",
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
        {selectedGenres.length > 0
          ? `Selected Genres: ${selectedGenres.join(", ")}`
          : "All Movies"}
      </Typography>

      {/* Control Buttons */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={() => setShowGenreBox((prev) => !prev)}
          sx={{ fontWeight: "bold" }}
        >
          {showGenreBox ? "Hide genres" : "Filter by genres"}
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            setSelectedGenres([]);
            setSortRating("");
            setVisibleCount(6);
            setShowGenreBox(false);
            // Clear sessionStorage when resetting
            sessionStorage.removeItem('filter-selected-genres');
            sessionStorage.removeItem('filter-sort-rating');
            sessionStorage.removeItem('filter-visible-count');
            sessionStorage.removeItem('filter-show-genre-box');
          }}
          disabled={selectedGenres.length === 0 && sortRating === "" && visibleCount === 6}
          sx={{
            borderColor: highlightColor,
            color: highlightColor,
            fontWeight: "bold",
            "&:hover": { borderColor: highlightColor, color: highlightColor },
          }}
        >
          Reset filter
        </Button>
      </Box>

      {/* Genre Box */}
      {showGenreBox && (
        <Paper
          elevation={3}
          sx={{ p: 2, mb: 3, bgcolor: bgPaper, color: textColor }}
        >
          <FormGroup>
            {allGenres.map((genre) => (
              <FormControlLabel
                key={genre}
                control={
                  <Checkbox
                    checked={selectedGenres.includes(genre)}
                    onChange={() => toggleGenre(genre)}
                    sx={{
                      color: highlightColor,
                      "&.Mui-checked": { color: highlightColor },
                    }}
                  />
                }
                label={genre}
              />
            ))}
          </FormGroup>
        </Paper>
      )}

      {/* Sort by Rating */}
      <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
        <FormControl sx={{ minWidth: 180 }} size="small">
          <InputLabel id="sort-rating-label">Sort by rating</InputLabel>
          <Select
            labelId="sort-rating-label"
            value={sortRating}
            onChange={(e) => setSortRating(e.target.value)}
          >
            <MenuItem value="">None</MenuItem>
            <MenuItem value="asc">Rating: Low to High</MenuItem>
            <MenuItem value="desc">Rating: High to Low</MenuItem>
          </Select>
        </FormControl>
      </Box>

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
        {filteredMovies.length === 0 ? (
          <Typography sx={{ color: textColor }}>No movies found.</Typography>
        ) : (
          filteredMovies.slice(0, visibleCount).map((movie) => (
            <Box
              key={movie.id}
              onClick={() => handleMovieClick(movie)}
              sx={{ cursor: "pointer", height: "100%" }}
            >
              <MovieCard movie={movie} />
            </Box>
          ))
        )}
      </Box>

      {/* Load More Button */}
      {visibleCount < filteredMovies.length && filteredMovies.length > 0 && (
        <Button
          variant="contained"
          onClick={handleLoadMore}
          sx={{
            mt: 3,
            backgroundColor: highlightColor,
            color: "#000",
            fontWeight: "bold",
            fontSize: 20,
            "&:hover": { backgroundColor: highlightColor },
            alignSelf: "center",
          }}
        >
          Load More
        </Button>
      )}
    </Box>
  );
}

export default Filter;
