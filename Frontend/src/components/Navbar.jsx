import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import useMovieSearch from "../hooks/useMovieSearch";
import { useAuth } from "../contexts/AuthContext";
import {
  Button,
  Box,
  Typography,
  Switch,
  TextField,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useThemeContext } from "../contexts/ThemeContext";

function Navbar() {
  const { currentUser, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const { mode, toggleTheme } = useThemeContext();

  const {
    searchQuery,
    searchResults,
    showSuggestions,
    handleSearchInputChange,
    clearSearch,
  } = useMovieSearch();

  function getInitials(name) {
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
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          CritiCrew
        </Link>

        <div className="nav-search">
          <form onSubmit={handleSearch} className="search-form">
            <TextField
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              size="small"
              variant="outlined"
              sx={{
                backgroundColor: mode === "dark" ? "#222" : "#fff",
                borderRadius: 1,
                input: { color: mode === "dark" ? "#fff" : "#000" },
              }}
            />
            <IconButton type="submit" sx={{ ml: 1 }} aria-label="search">
              <SearchIcon sx={{ color: "#f5c518" }} />
            </IconButton>
          </form>

          {showSuggestions && searchResults.length > 0 && (
            <div className="search-suggestions">
              {searchResults.map((movie) => (
                <div
                  key={movie.id}
                  className="suggestion-item"
                  onClick={() => handleSuggestionClick(movie)}
                  style={{ cursor: "pointer" }}
                >
                  {movie.title} ({movie.year}) - ⭐{movie.rating}
                </div>
              ))}
            </div>
          )}
        </div>

        <ul className="nav-menu">
          <li className="nav-item">
            <Link to="/" className="nav-link">
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/filter" className="nav-link">
              Filter
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/random" className="nav-link">
              Random Movie
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">
              About Us
            </Link>
          </li>
          <li className="nav-item">
            {isAdmin && (
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
            )}
          </li>
        </ul>
        <Box sx={{ p: 4, textAlign: "center" }}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={1}
          >
            <Brightness4Icon sx={{ color: "#757ce8" }} />
            <Switch
              checked={mode === "dark"}
              onChange={toggleTheme}
              color="default"
              inputProps={{ "aria-label": "theme switch" }}
            />
            <Brightness7Icon sx={{ color: "#f5c518" }} />
          </Box>
        </Box>

        <div className="nav-profile">
          <Link to={"/profile"}>
            <button className="avatar-button">
              {getInitials(currentUser.name)}
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
