import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import allMovies from "../../services/moviesService";
import "../../styles/Filter.css";
import MovieCard from "../../components/MovieCard";

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
        <h2>
          {selectedGenres.length > 0
            ? `Selected Genres: ${selectedGenres.join(", ")}`
            : "All Movies"}
        </h2>

        <button
          className="toggle-genres-btn"
          onClick={() => setShowGenreBox((prev) => !prev)}
        >
          {showGenreBox ? "Hide genres" : "Filter by genres"}
        </button>

        {showGenreBox && (
          <div className="genre-box">
            {allGenres.map((genre) => (
              <label key={genre} className="genre-option">
                <input
                  type="checkbox"
                  checked={selectedGenres.includes(genre)}
                  onChange={() => toggleGenre(genre)}
                />
                {genre}
              </label>
            ))}
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
          <button className="load-more" onClick={handleLoadMore}>
            Load More
          </button>
        )}
      </main>
    </div>
  );
}

export default Filter;
