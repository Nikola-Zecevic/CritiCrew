import moviesService from "../services/moviesService";

// Simple deterministic shuffle (Fisher-Yates using a seeded random)
function seededShuffle(array, seed) {
    const result = [...array];
    let m = result.length,
        t,
        i;

    function random() {
        const x = Math.sin(seed++) * 10000;
        return x - Math.floor(x);
    }

    while (m) {
        i = Math.floor(random() * m--);
        t = result[m];
        result[m] = result[i];
        result[i] = t;
    }
    return result;
}

export function getMovieOfTheDay(allMovies = []) {
    // If no movies provided, return null (component should handle this)
    if (!allMovies || allMovies.length === 0) {
        return null;
    }

    const today = new Date();
    const year = today.getFullYear();

    // Calculate day of year (1–365/366)
    const dayOfYear = Math.floor(
        (today - new Date(year, 0, 0)) / 1000 / 60 / 60 / 24
    );

    // Shuffle movie list deterministically for this year
    const shuffled = seededShuffle(allMovies, year);

    // Pick today's movie, wrap if days > movies
    const index = (dayOfYear - 1) % shuffled.length;

    return shuffled[index];
}