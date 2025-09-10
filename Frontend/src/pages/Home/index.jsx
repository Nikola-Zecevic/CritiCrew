import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import styles from "../../styles/Page.module.css";
import allMovies from "../../services/moviesService";

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
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Welcome to CritiCrew</h1>
        <p className={styles.heroText}>
          Your ultimate destination for movie ratings, reviews, and information.
        </p>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>🎬 Movie of the Day</h2>
        <div
          className={styles.featuredMovie}
          onClick={() => handleMovieClick(allMovies[0])}
          style={{ cursor: "pointer" }}
        >
          <img
            src={allMovies[0].image}
            alt={allMovies[0].title}
            className={styles.featuredImage}
          />
          <div className={styles.featuredInfo}>
            <h3 className={styles.movieTitle}>{allMovies[0].title}</h3>
            <p className={styles.movieRating}>⭐ {allMovies[0].rating}/10</p>
            <p className={styles.movieDescription}>
              {allMovies[0].description}
            </p>
            <button className={styles.readMoreBtn}>Read More →</button>
          </div>
        </div>
      </div>

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
              className={styles.movieCard}
              onClick={() => handleMovieClick(movie)}
              style={{ cursor: "pointer" }}
            >
              <img
                src={movie.image}
                alt={movie.title}
                className={styles.movieImage}
              />
              <div className={styles.movieInfo}>
                <h3 className={styles.movieTitle}>{movie.title}</h3>
                <p className={styles.movieRating}>⭐ {movie.rating}/10</p>
                <p className={styles.movieYear}>{movie.year}</p>
              </div>
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
