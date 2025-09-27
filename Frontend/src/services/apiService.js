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
      // Merge headers properly
      const headers = {
        ...this.api.defaults.headers,
        ...options.headers,
      };

      // Try direct connection first
      const response = await this.api({
        url: endpoint,
        headers,
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
  async getAllMovies(genre = null, sort = 'desc') {
    const params = new URLSearchParams();
    if (genre) {
      params.append('genre', genre);
    }
    if (sort) {
      params.append('sort', sort);
    }
    
    const url = params.toString() ? `/movies/?${params.toString()}` : '/movies/';
    return await this.makeRequest(url, { method: 'GET' });
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
    
    return await this.makeRequest(`/movies/?${params.toString()}`, { method: 'GET' });
  }

  // Review-related API calls
  async getMovieReviews(movieId) {
    // Use the correct endpoint with query parameter
    return await this.makeRequest(`/reviews/?movie_id=${movieId}`, { method: 'GET' });
  }

  async getAllReviews() {
    // Get all reviews without movie filter
    return await this.makeRequest('/reviews/', { method: 'GET' });
  }

  async createReview(reviewData) {
    // Get auth token from localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    return await this.makeRequest('/reviews/', {
      method: 'POST',
      data: reviewData,
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
  }

  async deleteReview(reviewId) {
    // Get auth token from localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    return await this.makeRequest(`/reviews/${reviewId}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
  }

  async updateReview(reviewId, reviewData) {
    // Get auth token from localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    return await this.makeRequest(`/reviews/${reviewId}`, {
      method: 'PUT',
      data: reviewData,
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
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
    // Backend expects form data for OAuth2PasswordRequestForm
    const formData = new FormData();
    formData.append('username', credentials.username);
    formData.append('password', credentials.password);
    
    return await this.makeRequest('/users/login', {
      method: 'POST',
      data: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  }

  // User management API calls (admin/superadmin only)
  async getAllUsers() {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    return await this.makeRequest('/users/', {
      method: 'GET',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
  }

  async deleteUser(userId) {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    return await this.makeRequest(`/users/${userId}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
  }

  async promoteUser(userId) {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    return await this.makeRequest(`/users/${userId}/promote`, {
      method: 'PUT',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
  }

  async demoteUser(userId) {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    return await this.makeRequest(`/users/${userId}/demote`, {
      method: 'PUT',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
  }

  // Get current user info from backend API
  async getCurrentUser() {
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    return await this.makeRequest('/users/me', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
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

  // Favorites-related API calls
  async getUserFavorites() {
    // Get auth token from localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    console.log('🔐 getUserFavorites - Token check:', {
      hasToken: !!token,
      tokenType: token ? (localStorage.getItem('token') ? 'token' : 'authToken') : 'none',
      tokenLength: token ? token.length : 0
    });
    
    return await this.makeRequest('/favorites/', {
      method: 'GET',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
  }

  async addToFavorites(movieId) {
    // Get auth token from localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    return await this.makeRequest('/favorites/', {
      method: 'POST',
      data: { movie_id: movieId },
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
  }

  async removeFromFavorites(movieId) {
    // Get auth token from localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    return await this.makeRequest(`/favorites/${movieId}`, {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
  }

  async checkFavoriteStatus(movieId) {
    // Get auth token from localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    return await this.makeRequest(`/favorites/check/${movieId}`, {
      method: 'GET',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
  }

  async getFavorites() {
    // Get auth token from localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    return await this.makeRequest('/favorites/', {
      method: 'GET',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
    });
  }

  async clearAllFavorites() {
    // Get auth token from localStorage
    const token = localStorage.getItem('token') || localStorage.getItem('authToken');
    
    return await this.makeRequest('/favorites/clear', {
      method: 'DELETE',
      headers: token ? { 'Authorization': `Bearer ${token}` } : {},
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