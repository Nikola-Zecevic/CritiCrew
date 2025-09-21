import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import useMovieSearch from "../hooks/useMovieSearch";
import { useAuth } from "../contexts/AuthContext";
import { Button, Box, Typography } from "@mui/material";
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
            <input
              type="text"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-button">
              🔍
            </button>
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
          <Button variant="contained" onClick={toggleTheme}>
            {mode === "dark" ? "Light theme" : "Dark theme"}
          </Button>
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
