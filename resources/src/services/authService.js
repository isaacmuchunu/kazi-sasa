import api from './api';

const authService = {
  /**
   * Register a new user
   */
  register: async (userData) => {
    return api.fetch('/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  /**
   * Login user
   */
  login: async (credentials) => {
    return api.fetch('/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  /**
   * Logout user
   */
  logout: async () => {
    return api.fetch('/logout', {
      method: 'POST',
    });
  },

  /**
   * Get current authenticated user
   */
  me: async () => {
    return api.fetch('/me');
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email) => {
    return api.fetch('/password/forgot', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  /**
   * Reset password
   */
  resetPassword: async (data) => {
    return api.fetch('/password/reset', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  /**
   * Get auth token
   */
  getToken: () => {
    return localStorage.getItem('auth_token');
  },

  /**
   * Set auth token
   */
  setToken: (token) => {
    localStorage.setItem('auth_token', token);
  },

  /**
   * Remove auth token
   */
  removeToken: () => {
    localStorage.removeItem('auth_token');
  },

  updateToken: (token) => {
    localStorage.setItem('auth_token', token);
  },
};

export default authService;
