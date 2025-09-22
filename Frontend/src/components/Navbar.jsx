import React from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  InputBase,
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Button,
  Avatar,
} from "@mui/material";
import { Search as SearchIcon, DarkMode, LightMode } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { useThemeContext } from "../contexts/ThemeContext";
import useMovieSearch from "../hooks/useMovieSearch";

export default function Navbar() {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeContext();

  const {
    searchQuery,
    searchResults,
    showSuggestions,
    handleSearchInputChange,
    clearSearch,
  } = useMovieSearch();

  function getInitials(name = "") {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }

  function handleSearch(e) {
    e.preventDefault();
  }

  function handleSuggestionClick(movie) {
    clearSearch();
    navigate(`/movie/${movie.slug}`);
  }

  return (
    <AppBar position="static" color="default" elevation={2}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* Logo */}
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
          }}
        >
          CritiCrew
        </Typography>

        {/* Search */}
        <Box sx={{ position: "relative", flexGrow: 1, maxWidth: 400, mx: 2 }}>
          <Paper
            component="form"
            onSubmit={handleSearch}
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              width: "100%",
            }}
          >
            <InputBase
              placeholder="Search movies…"
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              sx={{ ml: 1, flex: 1 }}
            />
            <IconButton type="submit" sx={{ p: "10px" }}>
              <SearchIcon />
            </IconButton>
          </Paper>

          {showSuggestions && searchResults.length > 0 && (
            <Paper
              sx={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                mt: 1,
                zIndex: 10,
                maxHeight: 250,
                overflowY: "auto",
              }}
            >
              <List>
                {searchResults.map((movie) => (
                  <ListItem key={movie.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleSuggestionClick(movie)}
                    >
                      <ListItemText
                        primary={`${movie.title} (${movie.year})`}
                        secondary={`⭐ ${movie.rating}`}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button component={RouterLink} to="/" color="inherit">
            Home
          </Button>
          <Button component={RouterLink} to="/filter" color="inherit">
            Filter
          </Button>
          <Button component={RouterLink} to="/random" color="inherit">
            Random Movie
          </Button>
          <Button component={RouterLink} to="/about" color="inherit">
            About Us
          </Button>
          {isAdmin && (
            <Button component={RouterLink} to="/dashboard" color="inherit">
              Dashboard
            </Button>
          )}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", ml: 2 }}>
          <IconButton onClick={toggleTheme} color="inherit">
            {mode === "light" ? <DarkMode /> : <LightMode />}
          </IconButton>

          <IconButton component={RouterLink} to="/profile" sx={{ ml: 1 }}>
            <Avatar sx={{ bgcolor: "primary.main", color: "white" }}>
              {getInitials(currentUser?.name || "U")}
            </Avatar>
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
