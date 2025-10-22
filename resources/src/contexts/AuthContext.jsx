import { createContext } from 'react';
import useAuthFunction from './useAuth';
import AuthProviderComponent from './AuthProvider';

export const AuthContext = createContext(null);
export { AuthProviderComponent as AuthProvider, useAuthFunction as useAuth };

export default AuthContext;
