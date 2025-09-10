import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import allMovies from "../services/moviesService";

function Navbar() {
  const user = { name: "Jane Doe" };
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  function getInitials(name) {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }

  function handleSearchInputChange(query) {
    setSearchQuery(query);
    if (query.length > 1) {
      const results = allMovies.filter((movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
      setShowSuggestions(true);
    } else {
      setSearchResults([]);
      setShowSuggestions(false);
    }
  }

  function handleSearch(e) {
    e.preventDefault();
    setShowSuggestions(false);
  }

  function handleSuggestionClick(movie) {
    setSearchQuery("");
    setShowSuggestions(false);
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
            <Link to="/custom" className="nav-link">
              Custom Page
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/about" className="nav-link">
              About Us
            </Link>
          </li>
        </ul>

        <div className="nav-profile">
          <button className="avatar-button">{getInitials(user.name)}</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
