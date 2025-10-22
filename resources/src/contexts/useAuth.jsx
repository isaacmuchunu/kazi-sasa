/* eslint-disable no-unused-vars */
import { useContext } from 'react';
import { AuthContext } from './AuthContext';

/* 
 * Custom hook for accessing authentication context
 * Returns the authentication context object
 * Throws error if used outside AuthProvider
 */
const useAuthFunction = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuthFunction;
