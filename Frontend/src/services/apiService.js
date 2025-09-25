// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://criticrew-1.onrender.com';

// API service class to handle all backend communications
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Generic fetch wrapper with error handling
  async fetchData(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  // Movie-related API calls
  async getAllMovies() {
    return await this.fetchData('/movies-view/');
  }

  async getMovieById(id) {
    return await this.fetchData(`/movies/${id}`);
  }

  async getMoviesByGenre(genre, sort = 'desc') {
    const params = new URLSearchParams();
    if (genre) {
      params.append('genre', genre);
    }
    if (sort) {
      params.append('sort', sort);
    }
    
    return await this.fetchData(`/movies-view/filter?${params.toString()}`);
  }

  // Review-related API calls (for future use)
  async getMovieReviews(movieId) {
    return await this.fetchData(`/reviews/movie/${movieId}`);
  }

  async createReview(reviewData) {
    return await this.fetchData('/reviews/', {
      method: 'POST',
      body: JSON.stringify(reviewData),
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();

export default apiService;