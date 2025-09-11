import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import allMovies from "../../services/moviesService";
import "../../styles/Filter.css";
import MovieCard from "../../components/MovieCard";

function Filter() {
  const [visibleCount, setVisibleCount] = useState(6);
  const navigate = useNavigate();

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  function handleMovieClick(movie) {
    navigate(`/movie/${movie.slug}`);
  }

  return (
    <div className="filter-page">
      <main className="filter-content">
        <h2>All Movies</h2>

        <div className="movies-grid">
          {allMovies.slice(0, visibleCount).map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMovieClick(movie)}
              style={{ cursor: "pointer" }}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        {visibleCount < allMovies.length && (
          <button className="load-more" onClick={handleLoadMore}>
            Load More
          </button>
        )}
      </main>
    </div>
  );
}

export default Filter;
