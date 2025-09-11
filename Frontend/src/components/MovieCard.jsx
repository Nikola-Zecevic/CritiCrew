import { Link } from "react-router-dom";
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
          <Link to={`/movie/${movie.slug}`} className={styles.readMoreBtn}>
            Read More
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
        <Link to={`/movie/${movie.slug}`} className={styles.readMoreBtn}>
          Read More
        </Link>
      </div>
    </div>
  );
}
