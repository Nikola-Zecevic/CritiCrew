import axios from 'axios';

// API configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://criticrew-1.onrender.com';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
const USE_CORS_PROXY = false; // Try direct first, fallback to proxy if needed

console.log('API_BASE_URL configured as:', API_BASE_URL);
console.log('Using CORS proxy:', USE_CORS_PROXY);

// API service class to handle all backend communications
class ApiService {
  constructor() {
    // Create main axios instance
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Create proxy axios instance
    this.proxyApi = axios.create({
      timeout: 15000,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
    });

    // Setup request interceptors
    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor for logging
    this.api.interceptors.request.use(
      (config) => {
        console.log('🔗 API Request:', `${config.baseURL}${config.url}`);
        return config;
      },
      (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for logging and error handling
    this.api.interceptors.response.use(
      (response) => {
        console.log('📊 Response Status:', response.status);
        console.log('✅ API Success - Data length:', Array.isArray(response.data) ? response.data.length : 'Not an array');
        return response;
      },
      (error) => {
        console.error('🚨 API Response Error:', error.message);
        return Promise.reject(error);
      }
    );
  }

  // Generic request wrapper with CORS proxy fallback
  async makeRequest(endpoint, options = {}) {
    try {
      // Try direct connection first
      const response = await this.api({
        url: endpoint,
        ...options,
      });
      return response.data;
    } catch (error) {
      // If CORS error and proxy is enabled, try with proxy
      if (USE_CORS_PROXY && this.isCorsError(error)) {
        console.log('🔄 CORS blocked, trying with proxy...');
        return await this.makeProxyRequest(endpoint, options);
      }
      
      // Handle different types of axios errors
      if (error.response) {
        // Server responded with error status
        console.error('Full error response:', error.response);
        
        let message = error.response.statusText || 'Server Error';
        
        // Handle validation errors (422)
        if (error.response.status === 422 && error.response.data?.detail) {
          if (Array.isArray(error.response.data.detail)) {
            // Pydantic validation errors
            const validationErrors = error.response.data.detail.map(err => 
              `${err.loc?.join('.')} - ${err.msg}`
            ).join(', ');
            message = `Validation Error: ${validationErrors}`;
          } else {
            message = `Validation Error: ${error.response.data.detail}`;
          }
        } else if (error.response.data?.message) {
          message = error.response.data.message;
        }
        
        throw new Error(`HTTP ${error.response.status}: ${message}`);
      } else if (error.request) {
        // Request was made but no response received (CORS/Network)
        throw new Error('CORS or Network error - unable to connect to server');
      } else {
        // Something else happened
        throw new Error(`Request Error: ${error.message}`);
      }
    }
  }

  // Make request through CORS proxy
  async makeProxyRequest(endpoint, options = {}) {
    try {
      const proxyUrl = `${CORS_PROXY}${encodeURIComponent(API_BASE_URL + endpoint)}`;
      const response = await this.proxyApi({
        url: proxyUrl,
        method: options.method || 'GET',
        data: options.data,
      });
      return response.data;
    } catch (error) {
      console.error('🚨 Proxy Request Failed:', error);
      throw new Error('Both direct and proxy requests failed');
    }
  }

  // Check if error is CORS-related
  isCorsError(error) {
    return (
      error.code === 'ERR_NETWORK' ||
      error.message.includes('Network Error') ||
      error.message.includes('CORS') ||
      (error.request && !error.response)
    );
  }

  // Movie-related API calls
  async getAllMovies() {
    return await this.makeRequest('/movies/', { method: 'GET' });
  }

  async getMovieById(id) {
    return await this.makeRequest(`/movies/${id}`, { method: 'GET' });
  }

  async getMoviesByGenre(genre, sort = 'desc') {
    const params = new URLSearchParams();
    if (genre) {
      params.append('genre', genre);
    }
    if (sort) {
      params.append('sort', sort);
    }
    
    return await this.makeRequest(`/movies-view/filter?${params.toString()}`, { method: 'GET' });
  }

  // Review-related API calls (for future use)
  async getMovieReviews(movieId) {
    return await this.makeRequest(`/reviews/movie/${movieId}`, { method: 'GET' });
  }

  async createReview(reviewData) {
    return await this.makeRequest('/reviews/', {
      method: 'POST',
      data: reviewData,
    });
  }

  async deleteReview(reviewId) {
    return await this.makeRequest(`/reviews/${reviewId}`, {
      method: 'DELETE',
    });
  }

  // User authentication API calls
  async registerUser(userData) {
    return await this.makeRequest('/users/register', {
      method: 'POST',
      data: userData,
    });
  }

  async loginUser(credentials) {
    return await this.makeRequest('/users/login', {
      method: 'POST',
      data: credentials,
    });
  }

  // Utility method for GET requests
  async get(endpoint, params = {}) {
    return await this.makeRequest(endpoint, {
      method: 'GET',
      params,
    });
  }

  // Utility method for POST requests
  async post(endpoint, data = {}) {
    return await this.makeRequest(endpoint, {
      method: 'POST',
      data,
    });
  }

  // Utility method for PUT requests
  async put(endpoint, data = {}) {
    return await this.makeRequest(endpoint, {
      method: 'PUT',
      data,
    });
  }

  // Utility method for DELETE requests
  async delete(endpoint) {
    return await this.makeRequest(endpoint, {
      method: 'DELETE',
    });
  }

  // Movie creation
  async createMovie(movieData) {
    return await this.makeRequest('/movies', {
      method: 'POST',
      data: movieData,
    });
  }

  // Movie update
  async updateMovie(movieId, movieData) {
    return await this.makeRequest(`/movies/${movieId}`, {
      method: 'PUT',
      data: movieData,
    });
  }

  // Movie deletion
  async deleteMovie(movieId) {
    return await this.makeRequest(`/movies/${movieId}`, {
      method: 'DELETE',
    });
  }

  // Alias for getAllMovies (for Dashboard compatibility)
  async getMovies() {
    return await this.getAllMovies();
  }
}

// Create and export a singleton instance
const apiService = new ApiService();

export default apiService;