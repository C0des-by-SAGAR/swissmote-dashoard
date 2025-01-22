import { createContext, useContext } from 'react';

const AuthContext = createContext();

const HARDCODED_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJOaXRlc2gifQ.YQXiLNdHeIz-drgnh7J1Ym2am_89ZM8yGjc9zigJlY0';

export const AuthProvider = ({ children }) => {
  // Set token in localStorage on initialization
  localStorage.setItem('access_token', HARDCODED_TOKEN);
  localStorage.setItem('token_type', 'Bearer');

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: true, // Always authenticated
      signOut: () => {}, // Empty function since we're bypassing auth
      isLoading: false
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