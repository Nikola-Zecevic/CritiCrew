
import React, { useState, useEffect } from "react";
import moviesService from "../../services/moviesService";
import Modal from "../../components/Modal";
import RandomMovieContainer from "../../components/RandomMovieContainer";
import RandomMovieHeader from "../../components/RandomMovieHeader";
import RandomMovieButton from "../../components/RandomMovieButton";
import { CircularProgress, Alert } from "@mui/material";

export default function Random() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const movies = await moviesService.getAllMovies();
        setAllMovies(movies);
      } catch (err) {
        setError('Failed to load movies: ' + err.message);
        console.error('Error loading movies:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, []);

  const getRandomMovie = () => {
    if (allMovies.length > 0) {
      const randomIndex = Math.floor(Math.random() * allMovies.length);
      setSelectedMovie(allMovies[randomIndex]);
    }
  };

  const handleClose = () => {
    setSelectedMovie(null);
  };

  if (loading) {
    return (
      <RandomMovieContainer>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
          <CircularProgress />
        </div>
      </RandomMovieContainer>
    );
  }

  if (error) {
    return (
      <RandomMovieContainer>
        <Alert severity="error">{error}</Alert>
      </RandomMovieContainer>
    );
  }

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