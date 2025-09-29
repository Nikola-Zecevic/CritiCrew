import { useState, useEffect } from "react";
import moviesService from "../services/moviesService";

export default function useMovieSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [allMovies, setAllMovies] = useState([]);

  // Load movies on component mount
  useEffect(() => {
    const loadMovies = async () => {
      try {
        const movies = await moviesService.getAllMovies();
        setAllMovies(movies || []);
      } catch (error) {
        console.error('Error loading movies for search:', error);
        setAllMovies([]);
      }
    };

    loadMovies();
  }, []);

  function handleSearchInputChange(query) {
    setSearchQuery(query);
    if (query.length > 1 && allMovies.length > 0) {
      const results = allMovies.filter((movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase()) ||
        movie.director?.toLowerCase().includes(query.toLowerCase()) ||
        movie.description?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results.slice(0, 8)); // Limit to 8 results for better UX
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

  function hideSuggestions() {
    setShowSuggestions(false);
  }

  return {
    searchQuery,
    searchResults,
    showSuggestions,
    handleSearchInputChange,
    clearSearch,
    hideSuggestions,
  };
}
