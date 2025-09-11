import { useState } from "react";
import allMovies from "../services/moviesService";

export default function useMovieSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  function clearSearch() {
    setSearchQuery("");
    setSearchResults([]);
    setShowSuggestions(false);
  }

  return {
    searchQuery,
    searchResults,
    showSuggestions,
    handleSearchInputChange,
    clearSearch,
  };
}
