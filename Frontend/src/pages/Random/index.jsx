
import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import allMovies from "../../services/moviesService";
import Modal from "../../components/Modal";

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
    <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '2rem 0',
      }}
    >
      <Typography
        variant="h1"
        sx={{
          color: '#f5c518',
          fontSize: '3rem',
          marginBottom: '1rem',
        }}
      >
        Random Movie Picker
      </Typography>
      <Typography
        sx={{
          fontSize: '1.2rem',
          color: '#ccc',
          marginBottom: '2rem',
        }}
      >
        Click the button to get a random movie!
      </Typography>
      <Button
        onClick={getRandomMovie}
        sx={{
          background: '#f5c518',
          color: '#000',
          border: 'none',
          borderRadius: '16px',
          fontWeight: 'bold',
          cursor: 'pointer',
          marginTop: '2rem',
          transition: 'all 0.3s ease',
          width: '140px',
          height: '140px',
          fontSize: '1.3rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          '&:hover': {
            background: '#ffdf5e',
            transform: 'scale(1.05)',
          },
        }}
      >
        Get Random Movie
      </Button>
      {selectedMovie && (
        <Modal
          isOpen={true}
          onClose={handleClose}
          movie={selectedMovie}
        />
      )}
    </Box>
  );
}