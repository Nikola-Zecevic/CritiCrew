
import React, { useState } from "react";
import allMovies from "../../services/moviesService";
import Modal from "../../components/Modal";
import RandomMovieContainer from "../../components/RandomMovieContainer";
import RandomMovieHeader from "../../components/RandomMovieHeader";
import RandomMovieButton from "../../components/RandomMovieButton";

export default function Random() {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const getRandomMovie = () => {
    const randomIndex = Math.floor(Math.random() * allMovies.length);
    setSelectedMovie(allMovies[randomIndex]);
  };

  const handleClose = () => {
    setSelectedMovie(null);
  };

  return (
    <RandomMovieContainer>
      <RandomMovieHeader />
      <RandomMovieButton onGetRandomMovie={getRandomMovie} />
      {selectedMovie && (
        <Modal
          isOpen={true}
          onClose={handleClose}
          movie={selectedMovie}
        />
      )}
    </RandomMovieContainer>
  );
}