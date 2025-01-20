import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';
import { useAuth } from '../../context/AuthContext';

const AuthLayout = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="auth-container">
      <div className="animated-bg"></div>
      <div className="auth-card">
        <div className="auth-content">
          <h1 className="auth-title">{isSignIn ? 'Welcome Back' : 'Create Account'}</h1>
          <p className="auth-subtitle">
            {isSignIn 
              ? 'Enter your credentials to access your account' 
              : 'Fill in the details to get started'}
          </p>
          {isSignIn ? (
            <SignInForm onToggleAuth={() => setIsSignIn(false)} />
          ) : (
            <SignUpForm onToggleAuth={() => setIsSignIn(true)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout; 