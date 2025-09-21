import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import allMovies from "../../services/moviesService";
import "../../styles/Filter.css";
import MovieCard from "../../components/MovieCard";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

function Filter() {
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [showGenreBox, setShowGenreBox] = useState(false);
  const navigate = useNavigate();

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  function handleMovieClick(movie) {
    navigate(`/movie/${movie.slug}`);
  }

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

  const filteredMovies =
    selectedGenres.length === 0
      ? allMovies
      : allMovies.filter((movie) =>
          selectedGenres.every((g) =>
            movie.genre.toLowerCase().includes(g.toLowerCase())
          )
        );

  return (
    <div className="filter-page">
      <main className="filter-content">
        <h2 style={{ marginBottom: "1rem" }}>
          {selectedGenres.length > 0
            ? `Selected Genres: ${selectedGenres.join(", ")}`
            : "All Movies"}
        </h2>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginBottom: "1.5rem",
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
        </div>

        {showGenreBox && (
          <div className="genre-box">
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
          </div>
        )}

        <div className="movies-grid">
          {filteredMovies.length === 0 ? (
            <p className="no-results">No movies found.</p>
          ) : (
            filteredMovies.slice(0, visibleCount).map((movie) => (
              <div
                key={movie.id}
                onClick={() => handleMovieClick(movie)}
                style={{ cursor: "pointer" }}
              >
                <MovieCard movie={movie} />
              </div>
            ))
          )}
        </div>

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
