
import React from "react";
import { Link, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useThemeContext } from "../../contexts/ThemeContext";

function NotFound() {
  const location = useLocation();
  const { theme } = useThemeContext();
  
  return (
    <Box 
      sx={{ 
        minHeight: 'calc(100vh - 120px)', // Account for navbar and footer 
        backgroundColor: theme.palette.background.default,
        py: 6, 
        px: { xs: 1, sm: 3 } 
      }}
    >
      {/* Hero Section */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          mb: 6, 
          backgroundColor: theme.palette.background.paper,
          borderRadius: 3, 
          p: { xs: 2, sm: 4 }, 
          boxShadow: 3,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography 
          variant="h2" 
          sx={{ 
            color: theme.palette.primary.main, 
            fontWeight: 'bold', 
            mb: 2, 
            letterSpacing: 1 
          }}
        >
          404 — Page Not Found
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: theme.palette.text.primary, 
            mb: 3 
          }}
        >
          We couldn't find "{location.pathname}". It may have been moved or deleted. Try going back home or explore our top movies.
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Button
            component={Link}
            to="/"
            variant="contained"
            sx={{ 
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              fontWeight: 'bold', 
              borderRadius: 2,
              '&:hover': {
                backgroundColor: theme.palette.primary.dark,
              }
            }}
          >
            ← Back to Home
          </Button>
          <Button
            component={Link}
            to="/movies"
            variant="contained"
            sx={{ 
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
              fontWeight: 'bold', 
              borderRadius: 2,
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark,
              }
            }}
          >
            🔎 Explore Movies
          </Button>
        </Box>
      </Box>

      {/* Image Section */}
      <Box 
        sx={{ 
          textAlign: 'center', 
          backgroundColor: theme.palette.background.paper,
          borderRadius: 3, 
          p: { xs: 2, sm: 4 }, 
          boxShadow: 3,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <img
          src="/images/not_found.jpg"
          alt="Cinema seats"
          style={{ 
            maxWidth: 480, 
            width: '100%', 
            borderRadius: 12, 
            boxShadow: `0 2px 12px ${theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.3)'}` 
          }}
        />
        <Typography 
          variant="body2" 
          sx={{ 
            color: theme.palette.text.secondary, 
            mt: 2 
          }}
        >
          Tip: Use the search bar in the header to quickly find any movie.
        </Typography>
      </Box>
    </Box>
  );
}

export default NotFound;
