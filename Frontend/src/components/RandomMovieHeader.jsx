import React from "react";
import Typography from "@mui/material/Typography";
import { useThemeContext } from "../contexts/ThemeContext.jsx";

export default function RandomMovieHeader() {
  const { mode } = useThemeContext();
  const textColor = mode === "dark" ? "#FFD700" : "#333";

  return (
    <>
      <Typography
        variant="h1"
        sx={{
          color: textColor,
          fontSize: '3rem',
          marginBottom: '1rem',
        }}
      >
        Random Movie Picker
      </Typography>
      <Typography
        sx={{
          fontSize: '1.2rem',
          color: mode === "dark" ? '#ccc' : '#666',
          marginBottom: '2rem',
        }}
      >
        Click the button to get a random movie!
      </Typography>
    </>
  );
}