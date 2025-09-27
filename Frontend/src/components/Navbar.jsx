import React, { useRef, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useMovieSearch from "../hooks/useMovieSearch";
import { useAuth } from "../contexts/AuthContext";
import { useThemeContext } from "../contexts/ThemeContext";
import { Box, TextField, IconButton } from "@mui/material";
import { LightMode, DarkMode, Shuffle } from "@mui/icons-material";
import { getRandomMovie } from "../utils/randomMovie";
import Modal from "./Modal";
export default function Navbar() {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { theme, mode, toggleTheme } = useThemeContext();
  const {
    searchQuery,
    searchResults,
    showSuggestions,
    handleSearchInputChange,
    clearSearch,
    hideSuggestions,
  } = useMovieSearch();
  const searchRef = useRef(null);
  // modal / random movie state
  const [randomMovie, setRandomMovie] = useState(null);
  const [openRandom, setOpenRandom] = useState(false);
  const handleSearch = (e) => {
    e.preventDefault();
    // we intentionally don't navigate here — suggestions handle selection
  };
  const handleSuggestionClick = (movie) => {
    clearSearch();
    navigate(`/movie/${movie.slug}`);
  };
  const getInitials = (name = "U") =>
    name
      .split(" ")
      .map((w) => (w ? w[0] : ""))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  // Close suggestions when clicking outside search
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        hideSuggestions();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [hideSuggestions]);
  const navLinks = [
    { label: "Home", to: "/" },
    { label: "Filter", to: "/filter" },
    { label: "About Us", to: "/about" },
  ];
  const navLinkStyle = {
    position: "relative",
    textDecoration: "none",
    color: theme.palette.text.primary,
    fontWeight: 600,
    fontSize: "1.1rem",
    px: 1,
    py: 0.5,
    transition: "color 0.2s ease",
    "&:hover": { color: theme.palette.primary.main },
    "&::after": {
      content: '""',
      position: "absolute",
      bottom: "-4px",
      left: 0,
      width: "0%",
      height: "2px",
      bgcolor: theme.palette.primary.main,
      transition: "width 0.3s ease-in-out",
    },
    "&:hover::after": { width: "100%" },
  };
  // fetch and open modal with random movie
  const handleRandomMovie = async () => {
    try {
      const movie = await getRandomMovie();
      setRandomMovie(movie);
      setOpenRandom(true);
    } catch (err) {
      console.error("Failed to fetch random movie:", err);
    }
  };
  return (
    <>
      {/* NAV container */}
      <Box
        component="nav"
        sx={{
          bgcolor: theme.palette.background.default,
          borderBottom: `2px solid ${theme.palette.primary.main}`,
          position: "sticky",
          top: 0,
          zIndex: 1200,
        }}
      >
        {/* Mobile header row: theme toggle | logo | avatar (one row) */}
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1,
          }}
        >
          {/* Theme toggle (left) */}
          <IconButton
            onClick={toggleTheme}
            sx={{
              bgcolor: theme.palette.background.paper,
              boxShadow: 2,
              "&:hover": { bgcolor: theme.palette.primary.light },
            }}
            aria-label="toggle theme"
          >
            {mode === "light" ? <DarkMode /> : <LightMode />}
          </IconButton>
          {/* Logo (center) */}
          <Box
            component={Link}
            to="/"
            sx={{
              color: theme.palette.primary.main,
              fontSize: "1.8rem",
              fontWeight: "bold",
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            CritiCrew
          </Box>
          {/* User avatar (right) */}
          <Box
            component={Link}
            to="/profile"
            sx={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: `2px solid ${theme.palette.primary.main}`,
              bgcolor: theme.palette.background.paper,
              color: theme.palette.primary.main,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textDecoration: "none",
              boxShadow: 2,
              "&:hover": {
                bgcolor: theme.palette.primary.main,
                color: theme.palette.getContrastText(
                  theme.palette.primary.main
                ),
                transform: "scale(1.05)",
              },
            }}
            aria-label="profile"
          >
            {getInitials(currentUser?.name)}
          </Box>
        </Box>
        {/* Main navbar content */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: 1200,
            mx: "auto",
            px: { xs: 2, sm: 3 },
            gap: { xs: 2, md: 3 },
            py: { xs: 1.5, md: 1.5 },
            flexDirection: { xs: "column", md: "row" },
            minHeight: { xs: "auto", md: 64 },
          }}
        >
          {/* Desktop Logo (left) */}
          <Box
            component={Link}
            to="/"
            sx={{
              color: theme.palette.primary.main,
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.4rem" },
              fontWeight: "bold",
              textDecoration: "none",
              textAlign: { xs: "center", md: "left" },
              width: { xs: "100%", md: "auto" },
              px: { xs: 1, md: 0 },
              py: { xs: 0.5, md: 0 },
              whiteSpace: "nowrap",
              overflow: "hidden",
              order: { xs: 1, md: 0 },
              display: { xs: "none", md: "block" },
            }}
          >
            CritiCrew
          </Box>
          {/* Search + Random button */}
          <Box
            ref={searchRef}
            sx={{
              flex: 1,
              maxWidth: { xs: "100%", md: 450 },
              width: "100%",
              position: "relative",
              order: { xs: 3, md: 0 },
              px: { xs: 1, md: 0 },
            }}
          >
            <Box
              component="form"
              onSubmit={handleSearch}
              sx={{ display: "flex", width: "100%" }}
            >
              <TextField
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => handleSearchInputChange(e.target.value)}
                size="medium"
                variant="outlined"
                sx={{
                  flex: 1,
                  bgcolor: theme.palette.background.paper,
                  borderRadius: "6px 0 0 6px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: theme.palette.divider,
                  },
                  "& .MuiInputBase-input": {
                    color: theme.palette.text.primary,
                  },
                }}
                inputProps={{ "aria-label": "search movies" }}
              />
              {/* Random button */}
              <IconButton
                onClick={handleRandomMovie}
                aria-label="random movie"
                sx={{
                  ml: 1,
                  bgcolor: theme.palette.primary.main,
                  borderRadius: "0 6px 6px 0",
                  "&:hover": { bgcolor: theme.palette.primary.light },
                }}
              >
                <Shuffle
                  sx={{
                    color: theme.palette.getContrastText(
                      theme.palette.primary.main
                    ),
                  }}
                />
              </IconButton>
            </Box>
            {/* Suggestions dropdown */}
            {showSuggestions && searchResults.length > 0 && (
              <Box
                sx={{
                  position: "absolute",
                  top: "calc(100% + 6px)",
                  left: 0,
                  right: 0,
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  borderTop: "none",
                  borderRadius: "0 0 6px 6px",
                  maxHeight: 220,
                  overflowY: "auto",
                  zIndex: 1400,
                }}
              >
                {searchResults.map((movie) => (
                  <Box
                    key={movie.id}
                    onClick={() => handleSuggestionClick(movie)}
                    sx={{
                      px: 2,
                      py: 1.5,
                      color: theme.palette.text.secondary,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: theme.palette.action.hover,
                        color: theme.palette.primary.main,
                      },
                      "&:last-child": { borderBottom: "none" },
                    }}
                  >
                    <Box sx={{ fontWeight: 600, mb: 0.5 }}>{movie.title}</Box>
                    <Box sx={{ fontSize: "0.875rem", opacity: 0.8 }}>
                      {movie.year && `Released: ${movie.year}`}
                      {movie.director && ` • Directed by ${movie.director}`}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          {/* Nav links */}
          <Box
            component="ul"
            sx={{
              display: "flex",
              listStyle: "none",
              gap: { xs: 1.5, sm: 2, md: 4 },
              m: 0,
              p: 0,
              order: { xs: 2, md: 0 },
              justifyContent: "center",
              flexWrap: "wrap",
              width: { xs: "100%", md: "auto" },
            }}
          >
            {navLinks.map((link) => (
              <li key={link.to}>
                <Box component={Link} to={link.to} sx={navLinkStyle}>
                  {link.label}
                </Box>
              </li>
            ))}
            {isAdmin && (
              <>
                <li>
                  <Box component={Link} to="/dashboard" sx={navLinkStyle}>
                    Dashboard
                  </Box>
                </li>
                <li>
                  <Box component={Link} to="/admin" sx={navLinkStyle}>
                    Admin
                  </Box>
                </li>
              </>
            )}
          </Box>
          {/* Desktop controls (theme toggle + avatar) */}
          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              gap: 2,
            }}
          >
            <IconButton
              onClick={toggleTheme}
              sx={{
                bgcolor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                "&:hover": { bgcolor: theme.palette.primary.light },
              }}
              aria-label="toggle theme"
            >
              {mode === "light" ? <DarkMode /> : <LightMode />}
            </IconButton>
            <Box
              component={Link}
              to="/profile"
              sx={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                border: `2px solid ${theme.palette.primary.main}`,
                bgcolor: theme.palette.background.paper,
                color: theme.palette.primary.main,
                fontWeight: "bold",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                "&:hover": {
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.getContrastText(
                    theme.palette.primary.main
                  ),
                  transform: "scale(1.05)",
                },
              }}
              aria-label="profile"
            >
              {getInitials(currentUser?.name)}
            </Box>
          </Box>
        </Box>
      </Box>
      {/* Random Movie Modal */}
      <Modal
        isOpen={openRandom}
        onClose={() => setOpenRandom(false)}
        movie={randomMovie}
      />
    </>
  );
}