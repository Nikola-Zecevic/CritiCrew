import React from "react";
import Button from "@mui/material/Button";

export default function RandomMovieButton({ onGetRandomMovie }) {
  return (
    <Button
      onClick={onGetRandomMovie}
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
  );
}