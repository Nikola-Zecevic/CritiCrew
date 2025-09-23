import React from "react";
import Typography from "@mui/material/Typography";

export default function RandomMovieHeader() {
  return (
    <>
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
    </>
  );
}