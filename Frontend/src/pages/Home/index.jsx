import React, { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import allMovies from "../../services/moviesService";
import MovieCard from "../../components/MovieCard";
import { Box, Typography } from "@mui/material";
import { useThemeContext } from "../../contexts/ThemeContext";
import { getMovieOfTheDay } from "../../utils/movieOfTheDay";

function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { mode } = useThemeContext();
  const moviesPerPage = 3;

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const totalPages = Math.ceil(allMovies.length / moviesPerPage);

  const currentMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * moviesPerPage;
    return allMovies.slice(startIndex, startIndex + moviesPerPage);
  }, [currentPage, moviesPerPage]);

  const handleMovieClick = (movie) => navigate(`/movie/${movie.slug}`);
  const handlePageChange = (page) => setSearchParams({ page });

  const textColor = mode === "dark" ? "#FFD700" : "#333";
  const sectionBg = mode === "dark" ? "#121212" : "#f9f9f9";

  // ✅ Get today's movie (deterministic, no repeats until list cycles)
  const movieOfTheDay = getMovieOfTheDay();

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
        <Box
          onClick={() => handleMovieClick(movieOfTheDay)}
          sx={{ cursor: "pointer" }}
        >
          <MovieCard movie={movieOfTheDay} isFeatured />
        </Box>
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
