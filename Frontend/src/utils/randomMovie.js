import moviesService from "../services/moviesService";
/**
 * Fetch a random movie from the moviesService
 * @returns {Promise<object|null>} A random movie object or null if none exist
 */
export async function getRandomMovie() {
  const movies = await moviesService.getAllMovies();
  if (!movies || movies.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * movies.length);
  return movies[randomIndex];
}