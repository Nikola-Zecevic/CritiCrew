import React, { useState, useMemo } from "react";
import Modal from "../../components/Modal";
import Pagination from "../../components/Pagination";
import styles from "../../styles/Page.module.css";

function Home() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const moviesPerPage = 3;

  // Enhanced movie data with real image paths
  const allMovies = [
    {
      id: 1,
      title: "The Shawshank Redemption",
      year: 1994,
      rating: 9.3,
      image: "/images/shawshank.jpg",
      description:
        "Two imprisoned men bond over a number of years, finding solace and eventual redemption.",
      genre: "Drama",
      duration: "142 min",
      director: "Frank Darabont",
    },
    {
      id: 2,
      title: "The Dark Knight",
      year: 2008,
      rating: 9.0,
      image: "/images/dark-knight.jpg",
      description:
        "Batman must accept one of the greatest psychological and physical tests.",
      genre: "Action, Crime, Drama",
      duration: "152 min",
      director: "Christopher Nolan",
    },
    {
      id: 3,
      title: "Pulp Fiction",
      year: 1994,
      rating: 8.9,
      image: "/images/pulp-fiction.jpg",
      description:
        "The lives of two mob hitmen, a boxer, and a gangster intertwine.",
      genre: "Crime, Drama",
      duration: "154 min",
      director: "Quentin Tarantino",
    },
    {
      id: 4,
      title: "Inception",
      year: 2010,
      rating: 8.8,
      image: "/images/inception.jpg",
      description:
        "A thief who steals corporate secrets through dream-sharing technology.",
      genre: "Action, Adventure, Sci-Fi",
      duration: "148 min",
      director: "Christopher Nolan",
    },
    {
      id: 5,
      title: "The Matrix",
      year: 1999,
      rating: 8.7,
      image: "/images/matrix.jpg",
      description:
        "A computer hacker learns from mysterious rebels about the true nature of his reality.",
      genre: "Action, Sci-Fi",
      duration: "136 min",
      director: "Lana Wachowski, Lilly Wachowski",
    },
    {
      id: 6,
      title: "Interstellar",
      year: 2014,
      rating: 8.6,
      image: "/images/interstellar.jpg",
      description:
        "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival.",
      genre: "Adventure, Drama, Sci-Fi",
      duration: "169 min",
      director: "Christopher Nolan",
    },
    {
      id: 7,
      title: "The Godfather",
      year: 1972,
      rating: 9.2,
      image: "/images/godfather.jpg",
      description:
        "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
      genre: "Crime, Drama",
      duration: "175 min",
      director: "Francis Ford Coppola",
    },
    {
      id: 8,
      title: "Forrest Gump",
      year: 1994,
      rating: 8.8,
      image: "/images/forest-gump.jpg",
      description:
        "The presidencies of Kennedy and Johnson, the events of Vietnam, and more.",
      genre: "Drama, Romance",
      duration: "142 min",
      director: "Robert Zemeckis",
    },
    {
      id: 9,
      title: "The Lord of the Rings",
      year: 2003,
      rating: 8.9,
      image: "/images/lotr.jpg",
      description:
        "Gandalf and Aragorn lead the World of Men against Sauron's army.",
      genre: "Adventure, Drama, Fantasy",
      duration: "201 min",
      director: "Peter Jackson",
    },
  ];

  const totalPages = Math.ceil(allMovies.length / moviesPerPage);

  const currentMovies = useMemo(() => {
    const startIndex = (currentPage - 1) * moviesPerPage;
    return allMovies.slice(startIndex, startIndex + moviesPerPage);
  }, [currentPage, moviesPerPage]);

  function handleMovieClick(movie) {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setSelectedMovie(null);
  }

  function handlePageChange(page) {
    setCurrentPage(page);
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Welcome to MovieDB</h1>
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

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        movie={selectedMovie}
      />
    </div>
  );
}

export default Home;
