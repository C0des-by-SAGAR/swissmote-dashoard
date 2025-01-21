import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth initialization error:', error);
        localStorage.removeItem('access_token');
        toast.error('Session expired. Please sign in again.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const signIn = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      const { access_token, user: userData } = response;
      
      localStorage.setItem('access_token', access_token);
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    }
  };

  const signUp = async (userData) => {
    try {
      const response = await authService.register(userData);
      const { access_token, user: newUser } = response;
      
      localStorage.setItem('access_token', access_token);
      setUser(newUser);
      setIsAuthenticated(true);
      return newUser;
    } catch (error) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const signOut = async () => {
    try {
      // Optional: Call logout endpoint if your API has one
      // await authService.logout();
      
      localStorage.removeItem('access_token');
      setUser(null);
      setIsAuthenticated(false);
      toast.success('Successfully signed out');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      signIn, 
      signUp, 
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