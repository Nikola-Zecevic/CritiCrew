import React from "react";
import Box from "@mui/material/Box";

export default function RandomMovieContainer({ children }) {
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
      {children}
    </Box>
  );
}