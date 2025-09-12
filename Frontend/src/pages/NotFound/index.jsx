import React from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "../../styles/Page.module.css";

function NotFound() {
  const location = useLocation();
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>404 — Page Not Found</h1>
        <p className={styles.heroText}>
          We couldn't find "{location.pathname}". It may have been moved or
          deleted. Try going back home or explore our top movies.
        </p>
        <div style={{ marginTop: "1.5rem" }}>
          <Link to="/" className={styles.readMoreBtn}>
            ⬅ Back to Home
          </Link>
          <Link to="/filter" className={styles.readMoreBtn} style={{ marginLeft: 12 }}>
            🔎 Explore Movies
          </Link>
        </div>
      </section>

      <section className={styles.section} style={{ textAlign: "center" }}>
        <img
          src="/images/not_found.jpg"
          alt="Cinema seats"
          className={styles.featuredImage}
          style={{ maxWidth: 480, width: "100%" }}
        />
        <p className={styles.movieDescription} style={{ marginTop: "1rem" }}>
          Tip: Use the search bar in the header to quickly find any movie.
        </p>
      </section>
    </div>
  );
}

export default NotFound;
