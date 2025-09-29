import apiService from './apiService.js';
import { fallbackMovies } from './fallbackMovies.js';

// Movies service - handles all movie-related data operations
class MoviesService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
    this.moviesCache = null;
    this.moviesCacheTime = null;
    this.isLoading = false;
    this.listeners = new Set(); // For rating update notifications
  }

  // Check if cached data is still valid
  isCacheValid(cacheTime) {
    if (!cacheTime) {
      return false;
    }
    return Date.now() - cacheTime < this.cacheTimeout;
  }

  // Get all movies with intelligent caching
  async getAllMovies(forceRefresh = false) {
    // Return cached data if valid and not forcing refresh
    if (!forceRefresh && this.moviesCache && this.isCacheValid(this.moviesCacheTime)) {
      console.log('🎯 MoviesService: Using cached movies data');
      return this.moviesCache;
    }

    // If already loading, wait for existing request
    if (this.isLoading) {
      console.log('⏳ MoviesService: Already loading, waiting for existing request...');
      return new Promise((resolve) => {
        const checkLoading = setInterval(() => {
          if (!this.isLoading && this.moviesCache) {
            clearInterval(checkLoading);
            resolve(this.moviesCache);
          }
        }, 100);
      });
    }

    // Set loading flag to prevent duplicate requests
    this.isLoading = true;

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
      
      // Cache the results
      this.moviesCache = transformed;
      this.moviesCacheTime = Date.now();
      console.log('💾 Cached movies data for', this.cacheTimeout / 1000 / 60, 'minutes');
      
      return transformed;
    } catch (error) {
      console.error('🚨 API Error Details:', error);
      console.warn('⚠️ API failed, using fallback or cached data. Error:', error.message);
      
      // Return cached data if available, even if expired
      if (this.moviesCache) {
        console.log('🔄 Using expired cached data as fallback');
        return this.moviesCache;
      }
      
      // Use fallback movies when API fails and no cache available
      console.log('📦 Loading fallback movies...');
      this.moviesCache = fallbackMovies;
      this.moviesCacheTime = Date.now();
      return fallbackMovies;
    } finally {
      this.isLoading = false;
    }
  }

  // Get single movie by ID - uses cached movies when available
  async getMovieById(id) {
    // Try to find movie in cached movies first
    if (this.moviesCache && this.isCacheValid(this.moviesCacheTime)) {
      const cachedMovie = this.moviesCache.find(movie => movie.id === parseInt(id));
      if (cachedMovie) {
        console.log(`🎯 MoviesService: Found movie ${id} in cache`);
        return cachedMovie;
      }
    }

    // If not in cache or cache invalid, fetch from API
    try {
      console.log(`🎬 MoviesService: Fetching movie ${id} from API...`);
      const movie = await apiService.getMovieById(id);
      const transformed = this.transformMovieData(movie);
      
      // Update cache with this movie if we have cached movies
      if (this.moviesCache) {
        const existingIndex = this.moviesCache.findIndex(m => m.id === transformed.id);
        if (existingIndex >= 0) {
          this.moviesCache[existingIndex] = transformed;
        } else {
          this.moviesCache.push(transformed);
        }
        console.log(`💾 Updated cache with movie ${id}`);
      }
      
      return transformed;
    } catch (error) {
      console.error(`Failed to fetch movie ${id}:`, error);
      throw new Error('Movie not found.');
    }
  }

  // Get movies by genre with sorting - uses cached movies when available
  async getMoviesByGenre(genre, sort = 'desc') {
    try {
      // Use cached movies for filtering when available
      if (this.moviesCache && this.isCacheValid(this.moviesCacheTime)) {
        console.log(`🎯 MoviesService: Filtering cached movies by genre: ${genre}`);
        let filteredMovies = this.moviesCache;
        
        // Filter by genre if specified
        if (genre && genre !== 'all') {
          filteredMovies = this.moviesCache.filter(movie => 
            movie.genres.some(g => g.toLowerCase() === genre.toLowerCase())
          );
        }
        
        // Sort movies
        return this.sortMovies(filteredMovies, sort);
      }

      // Fallback to API if cache not available
      console.log(`🎬 MoviesService: Fetching movies by genre from API: ${genre}`);
      const movies = await apiService.getMoviesByGenre(genre, sort);
      return this.transformMoviesData(movies);
    } catch (error) {
      console.error(`Failed to fetch movies for genre ${genre}:`, error);
      throw new Error('Unable to load movies for this genre.');
    }
  }

  // Helper method to sort movies
  sortMovies(movies, sort = 'desc') {
    const sorted = [...movies].sort((a, b) => {
      switch (sort) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'year':
          return b.year - a.year;
        case 'rating':
          return b.rating - a.rating;
        case 'asc':
          return a.title.localeCompare(b.title);
        case 'desc':
        default:
          return b.year - a.year;
      }
    });
    console.log(`🔄 Sorted ${sorted.length} movies by ${sort}`);
    return sorted;
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
      const results = movies.filter(movie => 
        movie.title.toLowerCase().includes(lowerQuery) ||
        movie.director.toLowerCase().includes(lowerQuery) ||
        movie.description.toLowerCase().includes(lowerQuery)
      );
      console.log(`🔍 Search for "${query}" returned ${results.length} results`);
      return results;
    } catch (error) {
      console.error('Failed to search movies:', error);
      return [];
    }
  }

  // Update movie rating in cached data
  updateMovieRating(movieId, newRating) {
    if (!this.moviesCache) {
      console.warn('⚠️ No cached movies to update rating for');
      return;
    }

    const movieIndex = this.moviesCache.findIndex(movie => movie.id === parseInt(movieId));
    if (movieIndex !== -1) {
      this.moviesCache[movieIndex].rating = newRating;
      this.moviesCache[movieIndex].isUserRating = true; // Mark as user-generated rating
      console.log(`✅ Updated movie ${movieId} rating to ${newRating.toFixed(1)} (from user reviews)`);
      
      // Notify all listeners about the rating change
      this.notifyListeners(movieId, newRating);
    } else {
      console.warn(`⚠️ Movie ${movieId} not found in cache for rating update`);
    }
  }

  // Event listener management
  addRatingUpdateListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback); // Return unsubscribe function
  }

  notifyListeners(movieId, newRating) {
    this.listeners.forEach(callback => {
      try {
        callback(movieId, newRating, this.moviesCache);
      } catch (error) {
        console.error('Error in rating update listener:', error);
      }
    });
  }

  // Get current rating for a movie
  getMovieRating(movieId) {
    if (!this.moviesCache) {
      return null;
    }

    const movie = this.moviesCache.find(movie => movie.id === parseInt(movieId));
    return movie ? movie.rating : null;
  }

  // Cache management methods
  clearCache() {
    this.moviesCache = null;
    this.moviesCacheTime = null;
    this.cache.clear();
    console.log('🗑️ Cache cleared');
  }

  refreshCache() {
    console.log('🔄 Refreshing cache...');
    return this.getAllMovies(true);
  }

  getCacheInfo() {
    return {
      hasCache: !!this.moviesCache,
      cacheSize: this.moviesCache ? this.moviesCache.length : 0,
      cacheAge: this.moviesCacheTime ? Date.now() - this.moviesCacheTime : null,
      isValid: this.isCacheValid(this.moviesCacheTime),
      expiresIn: this.moviesCacheTime ? 
        Math.max(0, this.cacheTimeout - (Date.now() - this.moviesCacheTime)) : null
    };
  }

  // Get cache statistics for debugging
  logCacheStats() {
    const info = this.getCacheInfo();
    console.log('📊 Cache Statistics:', {
      ...info,
      cacheAgeMinutes: info.cacheAge ? Math.round(info.cacheAge / 1000 / 60 * 100) / 100 : null,
      expiresInMinutes: info.expiresIn ? Math.round(info.expiresIn / 1000 / 60 * 100) / 100 : null
    });
  }
}

// Create and export singleton instance
const moviesService = new MoviesService();

export default moviesService;
