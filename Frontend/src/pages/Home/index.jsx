import React, { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import allMovies from "../../services/moviesService";
import MovieCard from "../../components/MovieCard";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function Home() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const moviesPerPage = 3;

  const currentPage = parseInt(searchParams.get("page") || "1", 10);
  const totalPages = Math.ceil(allMovies.length / moviesPerPage);

  const currentMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * moviesPerPage;
    return allMovies.slice(startIndex, startIndex + moviesPerPage);
  }, [currentPage, moviesPerPage]);

  function handleMovieClick(movie) {
    navigate(`/movie/${movie.slug}`);
  }

  function handlePageChange(page) {
    setSearchParams({ page });
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#181818",
        py: 4,
        px: { xs: 1, sm: 3 },
      }}
    >
      {/* Movie of the Day */}
      <Box
        sx={{
          mb: 6,
          background: "#232323",
          borderRadius: 3,
          p: { xs: 2, sm: 4 },
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: "#f5c518", fontWeight: "bold", mb: 3, letterSpacing: 1 }}
        >
          🎬 Movie of the Day
        </Typography>
        <Box
          onClick={() => handleMovieClick(allMovies[0])}
          sx={{ cursor: "pointer" }}
        >
          <MovieCard movie={allMovies[0]} isFeatured />
        </Box>
      </Box>

      {/* Top Rated Movies */}
      <Box
        sx={{
          background: "#232323",
          borderRadius: 3,
          p: { xs: 2, sm: 4 },
          boxShadow: 3,
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: "#f5c518", fontWeight: "bold", mb: 3, letterSpacing: 1 }}
        >
          🔥 Top Rated Movies
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: "center",
            mb: 3,
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Box>
    </Box>
  );
}

export default Home;
