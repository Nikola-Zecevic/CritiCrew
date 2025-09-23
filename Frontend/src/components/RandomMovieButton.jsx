import React from "react";
import Button from "@mui/material/Button";
import { useThemeContext } from "../contexts/ThemeContext.jsx";

export default function RandomMovieButton({ onGetRandomMovie }) {
  const { mode } = useThemeContext();
  const buttonColor = mode === "dark" ? "#f5c518" : "#333";
  const hoverColor = mode === "dark" ? "#ffdf5e" : "#555";

  return (
    <Button
      onClick={onGetRandomMovie}
      sx={{
        background: buttonColor,
        color: mode === "dark" ? '#000' : '#fff',
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
          background: hoverColor,
          transform: 'scale(1.05)',
        },
      }}
    >
      Get Random Movie
    </Button>
  );
}