import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
  const user = { name: "Jane Doe" };
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Movie data for search - using the same data as Home.jsx
  const mockMovies = [
    { id: 1, title: "The Shawshank Redemption", year: 1994, rating: 9.3 },
    { id: 2, title: "The Dark Knight", year: 2008, rating: 9.0 },
    { id: 3, title: "Pulp Fiction", year: 1994, rating: 8.9 },
    { id: 4, title: "Inception", year: 2010, rating: 8.8 },
    { id: 5, title: "The Matrix", year: 1999, rating: 8.7 },
    { id: 6, title: "Interstellar", year: 2014, rating: 8.6 },
    { id: 7, title: "The Godfather", year: 1972, rating: 9.2 },
    { id: 8, title: "Forrest Gump", year: 1994, rating: 8.8 },
    { id: 9, title: "The Lord of the Rings", year: 2003, rating: 8.9 },
  ];

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
      const results = mockMovies.filter((movie) =>
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
    console.log("Searching for:", searchQuery);
    setShowSuggestions(false);
  }

  function handleSuggestionClick(movie) {
    setSearchQuery(movie.title);
    setShowSuggestions(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          MovieDB
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
