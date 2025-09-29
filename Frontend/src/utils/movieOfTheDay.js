// utils/movieOfTheDay.js
import apiService from "../services/apiService";

// Only consider IMDb >= 7.0
function isGoodMovie(omdbData) {
  if (!omdbData) return false;
  const imdb = parseFloat(omdbData.imdbRating);
  return !isNaN(imdb) && imdb >= 7;
}

// Deterministic pick of the day (still used for fairness)
function pickForToday(goodMovies) {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const index =
    Math.abs(today.split("").reduce((sum, c) => sum + c.charCodeAt(0), 0)) %
    goodMovies.length;
  return goodMovies[index];
}

export async function getMovieOfTheDay(allMovies) {
  if (!allMovies || allMovies.length === 0) return null;

  const today = new Date().toISOString().slice(0, 10);

  // Check localStorage first
  const cached = JSON.parse(localStorage.getItem("movieOfTheDay") || "null");
  if (cached && cached.date === today) {
    return cached.movie; // return stored movie for today
  }

  // Otherwise, compute fresh
  const moviesWithData = await Promise.all(
    allMovies.map(async (m) => {
      try {
        const omdb = await apiService.getMovieFromOMDb(m.title || m.name);
        return { movie: m, omdb };
      } catch {
        return { movie: m, omdb: null };
      }
    })
  );

  const goodMovies = moviesWithData
    .filter(({ omdb }) => isGoodMovie(omdb))
    .map(({ movie }) => movie);

  if (goodMovies.length === 0) return null;

  const selected = pickForToday(goodMovies);

  // Store result in localStorage for the rest of the day
  localStorage.setItem(
    "movieOfTheDay",
    JSON.stringify({ date: today, movie: selected })
  );

  return selected;
}
