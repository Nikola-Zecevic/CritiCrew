import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import moviesService from "../../services/moviesService";
import MovieCard from "../../components/MovieCard";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { useThemeContext } from "../../contexts/ThemeContext";
import { getMovieOfTheDay } from "../../utils/movieOfTheDay";

function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mode } = useThemeContext();

  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [movieOfTheDay, setMovieOfTheDay] = useState(null);

  const moviesPerPage = 3;

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const movies = await moviesService.getAllMovies();
        setAllMovies(movies);
      } catch (err) {
        setError("Failed to load movies: " + err.message);
        console.error("Error loading movies:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();

    // Listen for rating updates
    const unsubscribe = moviesService.addRatingUpdateListener(
      (movieId, newRating, updatedMovies) => {
        console.log(
          `🔄 Home: Received rating update for movie ${movieId}, refreshing movie list`
        );
        setAllMovies([...updatedMovies]); // Create new array to trigger re-render
      }
    );

    return unsubscribe; // Cleanup listener on unmount
  }, []);

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const totalPages = Math.ceil(allMovies.length / moviesPerPage);

  const currentMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * moviesPerPage;
    return allMovies.slice(startIndex, startIndex + moviesPerPage);
  }, [allMovies, currentPage, moviesPerPage]);

  const handleMovieClick = (movie) => navigate(`/movie/${movie.slug}`);
  const handlePageChange = (page) => setSearchParams({ page });

  const textColor = mode === "dark" ? "#FFD700" : "#333";
  const sectionBg = mode === "dark" ? "#121212" : "#f9f9f9";

  // ✅ Get today's movie (deterministic, no repeats until list cycles)
  useEffect(() => {
    const loadMovieOfTheDay = async () => {
      if (allMovies.length > 0) {
        const selected = await getMovieOfTheDay(allMovies);
        setMovieOfTheDay(selected);
      }
    };
    loadMovieOfTheDay();
  }, [allMovies]);

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
        gap: 6,
      }}
    >
      {/* Movie of the Day */}
      <Box sx={{ backgroundColor: sectionBg, p: 3, borderRadius: 2 }}>
        <Typography
          variant="h4"
          sx={{
            color: textColor,
            mb: 3,
            textAlign: "center",
            fontWeight: 700,
          }}
        >
          🎬 Movie of the Day
        </Typography>
        {movieOfTheDay ? (
          <Box
            onClick={() => handleMovieClick(movieOfTheDay)}
            sx={{ cursor: "pointer" }}
          >
            <MovieCard movie={movieOfTheDay} isFeatured />
          </Box>
        ) : (
          <Typography
            variant="body1"
            sx={{
              color: textColor,
              textAlign: "center",
              fontStyle: "italic",
            }}
          >
            Loading movie of the day...
          </Typography>
        )}
      </Box>

      {/* Top Rated Movies */}
      <Box sx={{ backgroundColor: sectionBg, p: 3, borderRadius: 2 }}>
        <Typography
          variant="h4"
          sx={{
            color: textColor,
            mb: 3,
            textAlign: "center",
            fontWeight: 700,
          }}
        >
          🔥 Top Rated Movies
        </Typography>

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
          {currentMovies.map((movie) => (
            <Box
              key={movie.id}
              onClick={() => handleMovieClick(movie)}
              sx={{ cursor: "pointer" }}
            >
              <MovieCard movie={movie} />
            </Box>
          ))}
        </Box>

        <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default Home;
