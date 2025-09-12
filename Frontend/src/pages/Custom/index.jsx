import React, { useState } from "react";
import styles from "../../styles/Random.module.css";
import allMovies from "../../services/moviesService";
import Modal from "../../components/Modal";

export default function Custom() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const getRandomMovie = () => {
    const randomIndex = Math.floor(Math.random() * allMovies.length);
    setSelectedMovie(allMovies[randomIndex]);
  };

  const handleClose = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.heroTitle}>Random Movie Picker</h1>
      <p className={styles.heroText}>Click the button to get a random movie!</p>
      <button className={styles.squareBtn} onClick={getRandomMovie}>
        Get Random Movie
      </button>
      {selectedMovie && (
        <Modal
          isOpen={true}
          onClose={handleClose}
          movie={selectedMovie}
        />
      )}
    </div>
  );
}