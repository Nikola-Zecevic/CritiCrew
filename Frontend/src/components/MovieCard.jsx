import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import { useThemeContext } from "../contexts/ThemeContext";
import { getDisplayRating } from "../utils/ratingUtils";
export default function MovieCard({ movie, isFeatured = false }) {
  const { theme } = useThemeContext();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isFavorited, setIsFavorited] = useState(false);
  const handleFavoriteToggle = (e) => {
    e.stopPropagation(); // stop triggering parent click
    setIsFavorited((prev) => !prev);
    // here you could also call API/context to save favorites
  };
  return (
    <Card
      sx={{
        position: "relative",
        display: isFeatured && !isSmallScreen ? "flex" : "block",
        flexDirection: isFeatured && !isSmallScreen ? "row" : "column",
        borderRadius: 2,
        overflow: "hidden",
        boxShadow: 3,
        backgroundColor: theme.palette.background.paper,
        "&:hover .favorite-btn": {
          opacity: 1,
        },
      }}
    >
      {/* Favorite button */}
      <IconButton
        onClick={handleFavoriteToggle}
        className="favorite-btn"
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          zIndex: 2,
          backgroundColor: theme.palette.background.paper,
          boxShadow: 2,
          "&:hover": { backgroundColor: theme.palette.background.default },
          opacity: 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {isFavorited ? (
          <Favorite sx={{ color: theme.palette.error.main }} />
        ) : (
          <FavoriteBorder sx={{ color: theme.palette.text.primary }} />
        )}
      </IconButton>
      <CardMedia
        component="img"
        image={movie.image}
        alt={movie.title}
        sx={{
          width: isFeatured && !isSmallScreen ? "40%" : "100%",
          height: isFeatured && !isSmallScreen ? "auto" : 280,
          objectFit: "cover",
        }}
      />
      <CardContent
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 1,
          p: isFeatured ? 3 : 2,
        }}
      >
        <Typography
          variant={isFeatured ? "h5" : "h6"}
          sx={{ fontWeight: 600, color: theme.palette.text.primary }}
        >
          {movie.title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.text.secondary }}
        >
          Year: {movie.year}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: theme.palette.secondary.main }}
        >
          ⭐{" "}
          {getDisplayRating(movie) === "No reviews"
            ? "No reviews"
            : `${getDisplayRating(movie)}/5`}
        </Typography>
        {isFeatured && (
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.primary, mt: 1 }}
          >
            {movie.description}
          </Typography>
        )}
        {!isFeatured && (
          <Typography
            variant="body2"
            sx={{ color: theme.palette.text.primary }}
          >
            {movie.genre}
          </Typography>
        )}
        <Box sx={{ mt: 2 }}>
          <Link to={`/movie/${movie.slug}`} style={{ textDecoration: "none" }}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.mode === "dark" ? "#000" : "#fff",
                fontWeight: 600,
                borderRadius: "6px",
                textTransform: "none",
                px: 2.5,
                py: 1,
                boxShadow: "none",
                "&:hover": {
                  backgroundColor: theme.palette.secondary.main,
                  color:
                    theme.palette.mode === "dark"
                      ? theme.palette.background.default
                      : "#111",
                  boxShadow: "0 2px 8px 0 rgba(0,0,0,0.10)",
                },
              }}
            >
              Read More
            </Button>
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}