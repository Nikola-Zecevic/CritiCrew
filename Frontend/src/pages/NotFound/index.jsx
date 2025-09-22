
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

function NotFound() {
  const location = useLocation();
  return (
    <Box sx={{ minHeight: '100vh', background: '#181818', py: 6, px: { xs: 1, sm: 3 } }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: 'center', mb: 6, background: '#232323', borderRadius: 3, p: { xs: 2, sm: 4 }, boxShadow: 3 }}>
        <Typography variant="h2" sx={{ color: '#f5c518', fontWeight: 'bold', mb: 2, letterSpacing: 1 }}>
          404 — Page Not Found
        </Typography>
        <Typography variant="body1" sx={{ color: '#fff', mb: 3 }}>
          We couldn't find "{location.pathname}". It may have been moved or deleted. Try going back home or explore our top movies.
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button
            component={Link}
            to="/"
            variant="contained"
            sx={{ background: '#f5c518', color: '#000', fontWeight: 'bold', borderRadius: 2 }}
          >
            ← Back to Home
          </Button>
          <Button
            component={Link}
            to="/filter"
            variant="contained"
            sx={{ background: '#f5c518', color: '#000', fontWeight: 'bold', borderRadius: 2 }}
          >
            🔎 Explore Movies
          </Button>
        </Box>
      </Box>

      {/* Image Section */}
      <Box sx={{ textAlign: 'center', background: '#232323', borderRadius: 3, p: { xs: 2, sm: 4 }, boxShadow: 3 }}>
        <img
          src="/images/not_found.jpg"
          alt="Cinema seats"
          style={{ maxWidth: 480, width: '100%', borderRadius: 12, boxShadow: '0 2px 12px #0008' }}
        />
        <Typography variant="body2" sx={{ color: '#ccc', mt: 2 }}>
          Tip: Use the search bar in the header to quickly find any movie.
        </Typography>
      </Box>
    </Box>
  );
}

export default NotFound;
