import React, { useState } from "react";
import allMovies from "../../services/moviesService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import "../../styles/Filter.css";

function Filter() {
  const [visibleCount, setVisibleCount] = useState(6);

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  return (
    <div className="filter-page">
      <main className="filter-content">
        <h2>All Movies</h2>

        <div className="movies-grid">
          {allMovies.slice(0, visibleCount).map((movie) => (
            <div key={movie.id} className="movie-card">
              <img src={movie.image} alt={movie.title} />
              <h3>{movie.title}</h3>
              <p>{movie.genre}</p>
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
