import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { access_token, token_type } = await authService.login();
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('token_type', token_type);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Authentication failed:', error);
        toast.error('Authentication failed. Please try again later.');
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div>Loading...</div>; // Or your loading component
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated,
      signOut,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 