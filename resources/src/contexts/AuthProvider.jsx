import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import { AuthContext } from './AuthContext';

function AuthProviderComponent({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken();
      
      if (token) {
        try {
          const response = await authService.me();
          setUser(response.data.data);
        } catch (err) {
          console.error('Auth check failed:', err);
          authService.removeToken();
        }
      }
      
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { user: userData, token } = response.data.data;
      
      authService.setToken(token);
      setUser(userData);
      setError(null);
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { user: newUser, token } = response.data.data;
      
      authService.setToken(token);
      setUser(newUser);
      setError(null);
      
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      authService.removeToken();
      setUser(null);
    }
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isCandidate: () => user?.user_type === 'candidate',
    isEmployer: () => user?.user_type === 'employer',
    isAdmin: () => user?.user_type === 'admin',
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export default AuthProviderComponent;
