import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Set default authenticated state to true to bypass login
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [user, setUser] = useState({
    id: 'temp_user',
    username: 'temp_user',
    role: 'user'
  });
  const [isLoading, setIsLoading] = useState(false);

  // Simplified mock methods
  const signIn = async () => {
    console.log('Sign in bypassed');
    return true;
  };

  const signUp = async () => {
    console.log('Sign up bypassed');
    return true;
  };

  const signOut = () => {
    console.log('Sign out bypassed');
  };

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