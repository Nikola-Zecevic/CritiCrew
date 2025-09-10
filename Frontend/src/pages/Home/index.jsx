import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import styles from "../../styles/Page.module.css";
import allMovies from "../../services/moviesService";
import MovieCard from "../../components/MovieCard";

function Home() {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 3;

  const totalPages = Math.ceil(allMovies.length / moviesPerPage);

  const currentMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * moviesPerPage;
    return allMovies.slice(startIndex, startIndex + moviesPerPage);
  }, [currentPage, moviesPerPage]);

  function handleMovieClick(movie) {
    navigate(`/movie/${movie.slug}`);
  }

  function handlePageChange(page) {
    setCurrentPage(page);
  }

  return (
    <div className={styles.page}>
      {/* Featured Movie */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🎬 Movie of the Day</h2>
        <div
          onClick={() => handleMovieClick(allMovies[0])}
          style={{ cursor: "pointer" }}
        >
          <MovieCard movie={allMovies[0]} isFeatured />
        </div>
      </div>

      {/* Top Rated Movies */}
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🔥 Top Rated Movies</h2>
        <p className={styles.pageInfo}>
          Showing {currentMovies.length} of {allMovies.length} movies (Page{" "}
          {currentPage} of {totalPages})
        </p>

        <div className={styles.movieGrid}>
          {currentMovies.map((movie) => (
            <div
              key={movie.id}
              onClick={() => handleMovieClick(movie)}
              style={{ cursor: "pointer" }}
            >
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}

export default Home;
