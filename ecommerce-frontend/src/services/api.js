import axios from 'axios';

/**
 * API Client Configuration
 * Handles all HTTP requests to the Laravel backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Required for Sanctum SPA authentication
});

// Request interceptor - Add auth token if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle common errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const { status } = error.response || {};

        // Handle authentication errors
        if (status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }

        // Handle forbidden errors
        if (status === 403) {
            console.error('Access forbidden');
        }

        // Handle validation errors
        if (status === 422) {
            return Promise.reject(error.response.data);
        }

        // Handle server errors
        if (status >= 500) {
            console.error('Server error occurred');
        }

        return Promise.reject(error);
    }
);

export default api;

/**
 * Helper function to get CSRF cookie for Sanctum
 * Must be called before login/register
 */
export const getCsrfCookie = async () => {
    await axios.get('http://localhost:8000/sanctum/csrf-cookie', {
        withCredentials: true,
    });
};
