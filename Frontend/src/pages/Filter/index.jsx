import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import allMovies from "../../services/moviesService";
import "../../styles/Filter.css";
import MovieCard from "../../components/MovieCard";
import {
  Button,
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Paper,
  useTheme,
} from "@mui/material";

function Filter() {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showGenreBox, setShowGenreBox] = useState(false);
  const [sortRating, setSortRating] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

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
    setVisibleCount(6);
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

  return (
    <div className="filter-page">
      <main className="filter-content">
        <h2 style={{ marginBottom: "1rem" }}>
          {selectedGenres.length > 0
            ? `Selected Genres: ${selectedGenres.join(", ")}`
            : "All Movies"}
        </h2>

        {/* Control Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "1rem",
            mb: "1.5rem",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            className="toggle-genres-btn"
            onClick={() => setShowGenreBox((prev) => !prev)}
          >
            {showGenreBox ? "Hide genres" : "Filter by genres"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setSelectedGenres([])}
            disabled={selectedGenres.length === 0}
            sx={{
              borderColor: "#f5c518",
              color: "#f5c518",
              fontWeight: "bold",
              "&:hover": { borderColor: "#cc0000", color: "#cc0000" },
            }}
          >
            Reset filter
          </Button>
        </Box>

        {/* Genre Box */}
        {showGenreBox && (
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mb: 3,
              bgcolor: theme.palette.background.paper,
              color: theme.palette.text.primary,
            }}
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
                        color: "#f5c518",
                        "&.Mui-checked": { color: "#f5c518" },
                      }}
                    />
                  }
                  label={genre}
                  className="genre-option"
                />
              ))}
            </FormGroup>
          </Paper>
        )}

        {/* Sort by Rating */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: "1.5rem",
            gap: "1rem",
          }}
        >
          <FormControl sx={{ minWidth: 180 }} size="small">
            <InputLabel id="sort-rating-label">Sort by rating</InputLabel>
            <Select
              labelId="sort-rating-label"
              id="sort-rating"
              value={sortRating}
              label="Sort by rating"
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
          className="movies-grid"
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.5rem",
          }}
        >
          {filteredMovies.length === 0 ? (
            <p className="no-results">No movies found.</p>
          ) : (
            filteredMovies.slice(0, visibleCount).map((movie) => (
              <Box
                key={movie.id}
                onClick={() => handleMovieClick(movie)}
                sx={{ cursor: "pointer" }}
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
            color="secondary"
            className="load-more"
            onClick={handleLoadMore}
            sx={{
              mt: 3,
              backgroundColor: "#f5c518",
              color: "#000",
              fontWeight: "bold",
              fontSize: 20,
              "&:hover": { backgroundColor: "#cc0000", color: "#fff" },
            }}
          >
            Load More
          </Button>
        )}
      </main>
    </div>
  );
}

export default Filter;
