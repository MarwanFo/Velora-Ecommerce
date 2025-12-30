import api, { getCsrfCookie } from './api';
import { API_ENDPOINTS } from '../constants/config';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

const authService = {
  /**
   * Register a new user
   */
  async register(data) {
    await getCsrfCookie();
    const response = await api.post(API_ENDPOINTS.register, data);
    
    if (response.data.data.token) {
      localStorage.setItem('auth_token', response.data.data.token);
    }
    
    return response.data;
  },

  /**
   * Login user
   */
  async login(credentials) {
    await getCsrfCookie();
    const response = await api.post(API_ENDPOINTS.login, credentials);
    
    if (response.data.data.token) {
      localStorage.setItem('auth_token', response.data.data.token);
    }
    
    return response.data;
  },

  /**
   * Logout user
   */
  async logout() {
    try {
      await api.post(API_ENDPOINTS.logout);
    } finally {
      localStorage.removeItem('auth_token');
    }
  },

  /**
   * Get current authenticated user
   */
  async getCurrentUser() {
    const response = await api.get(API_ENDPOINTS.user);
    return response.data.data;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('auth_token');
  },

  /**
   * Get auth token
   */
  getToken() {
    return localStorage.getItem('auth_token');
  },
};

export default authService;
