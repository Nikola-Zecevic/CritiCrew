import React from "react";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { Card, CardMedia } from "@mui/material";
import styles from "../styles/Page.module.css";
export default function MovieCard({ movie, isFeatured = false }) {
  if (isFeatured) {
    return (
      <Card
        sx={{
          display: "flex",
          mb: 3,
          boxShadow: 6,
          borderRadius: 3,
          background: "#232323",
          color: "#fff",
        }}
      >
        <CardMedia
          component="img"
          image={movie.image}
          alt={movie.title}
          sx={{ width: 220, borderRadius: 3, objectFit: "cover", m: 2 }}
        />

        <div className={styles.featuredInfo}>
          <h3 className={styles.movieTitle}>{movie.title}</h3>
          <p className={styles.movieYear}>Year: {movie.year}</p>
          <p className={styles.movieRating}>⭐ {movie.rating}/10</p>
          <p className={styles.movieDescription}>{movie.description}</p>
          <Link to={`/movie/${movie.slug}`}>
            <Button className={styles.readMoreBtn} variant="contained">
              Read More
            </Button>
          </Link>
        </div>
      </Card>
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
          <Button className={styles.readMoreBtn} variant="contained">
            Read More
          </Button>
        </Link>
      </div>
    </div>
  );
}
