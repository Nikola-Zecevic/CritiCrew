import apiService from './apiService.js';
import { fallbackMovies } from './fallbackMovies.js';

// Movies service - handles all movie-related data operations
class MoviesService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  // Get all movies from backend
  async getAllMovies() {
    try {
      console.log('🎬 MoviesService: Fetching movies from API...');
      const movies = await apiService.getAllMovies();
      
      if (!Array.isArray(movies)) {
        console.error('❌ Invalid response format, expected array but got:', typeof movies);
        throw new Error('Invalid response format');
      }
      
      console.log('✅ API Success: Received', movies.length, 'movies');
      const transformed = this.transformMoviesData(movies);
      console.log('🔄 Transformed', transformed.length, 'movies');
      return transformed;
    } catch (error) {
      console.error('🚨 API Error Details:', error);
      console.warn('⚠️ API failed, using fallback movies. Error:', error.message);
      
      // Use fallback movies when API fails (CORS or network issues)
      console.log('📦 Loading fallback movies...');
      return fallbackMovies;
    }
  }

  // Get single movie by ID
  async getMovieById(id) {
    try {
      const movie = await apiService.getMovieById(id);
      return this.transformMovieData(movie);
    } catch (error) {
      console.error(`Failed to fetch movie ${id}:`, error);
      throw new Error('Movie not found.');
    }
  }

  // Get movies by genre with sorting
  async getMoviesByGenre(genre, sort = 'desc') {
    try {
      const movies = await apiService.getMoviesByGenre(genre, sort);
      return this.transformMoviesData(movies);
    } catch (error) {
      console.error(`Failed to fetch movies for genre ${genre}:`, error);
      throw new Error('Unable to load movies for this genre.');
    }
  }

  // Get movie by slug (for routing)
  async getMovieBySlug(slug) {
    try {
      const movies = await this.getAllMovies();
      return movies.find(movie => movie.slug === slug) || null;
    } catch (error) {
      console.error(`Failed to fetch movie by slug ${slug}:`, error);
      return null;
    }
  }

  // Transform backend movie data to match frontend expectations
  transformMoviesData(movies) {
    return movies.map(movie => this.transformMovieData(movie));
  }

  transformMovieData(movie) {
    return {
      id: movie.id,
      slug: movie.slug,
      title: movie.title,
      year: movie.year,
      rating: movie.rating || 0,
      image: movie.image,
      description: movie.description,
      genre: Array.isArray(movie.genres) ? movie.genres.join(', ') : movie.genres || '',
      genres: Array.isArray(movie.genres) ? movie.genres : [],
      director: movie.director,
      // Add duration field - you might want to add this to your backend schema
      duration: movie.duration || 'N/A'
    };
  }

  // Get unique genres from all movies
  async getUniqueGenres() {
    try {
      const movies = await this.getAllMovies();
      const allGenres = movies.flatMap(movie => movie.genres);
      return [...new Set(allGenres)].sort();
    } catch (error) {
      console.error('Failed to fetch genres:', error);
      return [];
    }
  }

  // Search movies by title
  async searchMovies(query) {
    try {
      const movies = await this.getAllMovies();
      const lowerQuery = query.toLowerCase();
      return movies.filter(movie => 
        movie.title.toLowerCase().includes(lowerQuery) ||
        movie.director.toLowerCase().includes(lowerQuery) ||
        movie.description.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Failed to search movies:', error);
      return [];
    }
  }
}

// Create and export singleton instance
const moviesService = new MoviesService();

export default moviesService;
