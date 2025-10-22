import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from './LoadingScreen';

const ProtectedRoute = ({ children, requireAuth = true, userType = null }) => {
  const { user, loading, isCandidate, isEmployer } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // Redirect to login if authentication is required and user is not logged in
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if user is logged in but shouldn't be (e.g., accessing login page)
  if (!requireAuth && user) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check user type if specified
  if (userType) {
    if (userType === 'candidate' && !isCandidate()) {
      return <Navigate to="/dashboard" replace />;
    }
    if (userType === 'employer' && !isEmployer()) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
