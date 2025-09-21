import React, { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import styles from "../../styles/Page.module.css";
import allMovies from "../../services/moviesService";
import MovieCard from "../../components/MovieCard";

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
    <div className={styles.page}>
      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🎬 Movie of the Day</h2>
        <div
          onClick={() => handleMovieClick(allMovies[0])}
          style={{ cursor: "pointer" }}
        >
          <MovieCard movie={allMovies[0]} isFeatured />
        </div>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🔥 Top Rated Movies</h2>

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
