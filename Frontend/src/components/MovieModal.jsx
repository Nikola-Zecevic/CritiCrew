
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "./Modal";
import moviesService from "../services/moviesService";
import { CircularProgress, Alert, Box } from "@mui/material";

function MovieModal() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMovie = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const movies = await moviesService.getAllMovies();
        const foundMovie = movies.find((m) => m.slug === slug);
        setMovie(foundMovie);
        
        if (!foundMovie) {
          setError('Movie not found');
        }
      } catch (err) {
        setError('Failed to load movie: ' + err.message);
        console.error('Error loading movie:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [slug]);

  function handleClose() {
    navigate(-1);
  }

  if (!slug) return null;

  if (loading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
        }}
      >
        <Alert severity="error" sx={{ m: 2 }}>
          {error}
          <button onClick={handleClose} style={{ marginLeft: '10px' }}>
            Close
          </button>
        </Alert>
      </Box>
    );
  }

  if (!movie) return null;

  return <Modal isOpen={true} onClose={handleClose} movie={movie} />;
}

export default MovieModal;
