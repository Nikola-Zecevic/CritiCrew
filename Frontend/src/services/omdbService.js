import apiService from "./apiService";

// Cache OMDb results to avoid multiple API calls per session
// Fetches OMDb ratings without hammering the API repeatedly.
const cache = {};

export async function getOMDbData(title) {
  if (!title) return null;
  if (cache[title]) return cache[title];

  try {
    const data = await apiService.getMovieFromOMDb(title);
    cache[title] = data;
    return data;
  } catch (err) {
    console.error("Failed to fetch OMDb for", title, err);
    return null;
  }
}
