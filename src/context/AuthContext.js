import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const AuthContext = createContext();

const HARDCODED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJOaXRlc2gifQ.YQXiLNdHeIz-drgnh7J1Ym2am_89ZM8yGjc9zigJlY0';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Bypass authentication and use hardcoded token
    try {
      localStorage.setItem('access_token', HARDCODED_TOKEN);
      localStorage.setItem('token_type', 'Bearer');
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Token storage failed:', error);
      toast.error('Authentication failed. Please try again later.');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const signOut = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('token_type');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return <div>Loading...</div>;
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