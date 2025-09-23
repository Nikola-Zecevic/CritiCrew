import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import allMovies from "../../services/moviesService";
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
} from "@mui/material";
import { useThemeContext } from "../../contexts/ThemeContext";

function Filter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode } = useThemeContext();

  // Read state from URL
  const queryParams = new URLSearchParams(location.search);
  const initialVisible = parseInt(queryParams.get("visibleCount")) || 6;
  const initialGenres = queryParams.get("genres")
    ? queryParams.get("genres").split(",")
    : [];
  const initialSort = queryParams.get("sortRating") || "";

  const [visibleCount, setVisibleCount] = useState(initialVisible);
  const [selectedGenres, setSelectedGenres] = useState(initialGenres);
  const [showGenreBox, setShowGenreBox] = useState(false);
  const [sortRating, setSortRating] = useState(initialSort);

  // Update URL when state changes
  const updateURL = (
    newVisible,
    newGenres = selectedGenres,
    newSort = sortRating
  ) => {
    const params = new URLSearchParams();
    if (newVisible > 6) params.set("visibleCount", newVisible);
    if (newGenres.length > 0) params.set("genres", newGenres.join(","));
    if (newSort) params.set("sortRating", newSort);
    navigate({ search: params.toString() }, { replace: true });
  };

  const handleLoadMore = () => {
    const newCount = visibleCount + 3;
    setVisibleCount(newCount);
    updateURL(newCount);
  };

  const handleMovieClick = (movie) => navigate(`/movie/${movie.slug}`);

  const allGenres = Array.from(
    new Set(
      allMovies.flatMap((movie) => movie.genre.split(",").map((g) => g.trim()))
    )
  );

  const toggleGenre = (genre) => {
    const newGenres = selectedGenres.includes(genre)
      ? selectedGenres.filter((g) => g !== genre)
      : [...selectedGenres, genre];
    setSelectedGenres(newGenres);
    setVisibleCount(6);
    updateURL(6, newGenres);
  };

  const handleSortChange = (value) => {
    setSortRating(value);
    updateURL(visibleCount, selectedGenres, value);
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
            setVisibleCount(6);
            setSortRating("");
            updateURL(6, [], "");
          }}
          disabled={selectedGenres.length === 0 && sortRating === ""}
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
            onChange={(e) => handleSortChange(e.target.value)}
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
