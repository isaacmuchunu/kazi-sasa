import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

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

  const isCandidate = () => user?.user_type === 'candidate';
  const isEmployer = () => user?.user_type === 'employer';
  const isAdmin = () => user?.user_type === 'admin';

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isCandidate,
    isEmployer,
    isAdmin,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export the module components separately to avoid preamble detection issues
export { AuthProvider };
export { useAuth };

// Default export
export default AuthContext;
