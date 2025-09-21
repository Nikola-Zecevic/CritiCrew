import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import styles from "../styles/Page.module.css";

export default function MovieCard({ movie, isFeatured = false }) {
  if (isFeatured) {
    return (
      <div className={styles.featuredMovie}>
        <img
          src={movie.image}
          alt={movie.title}
          className={styles.featuredImage}
        />
        <div className={styles.featuredInfo}>
          <h3 className={styles.movieTitle}>{movie.title}</h3>
          <p className={styles.movieYear}>Year: {movie.year}</p>
          <p className={styles.movieRating}>⭐ {movie.rating}/10</p>
          <p className={styles.movieDescription}>{movie.description}</p>
          <Link to={`/movie/${movie.slug}`}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#f5c518",
                color: "#222",
                fontWeight: 600,
                borderRadius: "6px",
                textTransform: "none",
                px: 2.5,
                py: 1,
                mt: 1.5,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: "#ffe082",
                  color: "#111",
                  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
                },
              }}
            >
              Read More
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.movieCard}>
      <img src={movie.image} alt={movie.title} className={styles.movieImage} />
      <div className={styles.movieInfo}>
        <h3 className={styles.movieTitle}>{movie.title}</h3>
        <p className={styles.movieYear}>Year: {movie.year}</p>
        <p className={styles.movieRating}>⭐ {movie.rating}/10</p>
        <p className={styles.movieGenres}>{movie.genre}</p>
        <Link to={`/movie/${movie.slug}`}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#f5c518",
              color: "#222",
              fontWeight: 600,
              borderRadius: "6px",
              textTransform: "none",
              px: 2.5,
              py: 1,
              mt: 1.5,
              boxShadow: "none",
              "&:hover": {
                backgroundColor: "#ffe082",
                color: "#111",
                boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
              },
            }}
          >
            Read More
          </Button>
        </Link>
      </div>
    </div>
  );
}
