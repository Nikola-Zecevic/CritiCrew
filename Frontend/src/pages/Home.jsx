import React from "react";
import styles from "../styles/Page.module.css";

function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Welcome to MovieDB</h1>
        <p className={styles.heroText}>
          Your ultimate destination for movie ratings, reviews, and information.
        </p>
      </div>

      <div className={styles.movieGrid}>
        <div className={styles.movieCard}>
          <h3 className={styles.movieTitle}>The Shawshank Redemption</h3>
          <p className={styles.movieRating}>⭐ 9.3/10</p>
        </div>

        <div className={styles.movieCard}>
          <h3 className={styles.movieTitle}>The Dark Knight</h3>
          <p className={styles.movieRating}>⭐ 9.0/10</p>
        </div>
      </div>
    </div>
  );
}

export default Home;
