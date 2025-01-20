import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import FormInput from './FormInput';

const SignInForm = ({ onToggleAuth }) => {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Directly call signIn with credentials
      await signIn(formData);
    } catch (error) {
      setError('An error occurred during sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-100">
      {error && (
        <div className="error-message mb3">
          {error}
        </div>
      )}

      <FormInput
        label="Email Address"
        type="email"
        id="email"
        value={formData.email}
        onChange={handleChange}
        required
        autoComplete="email"
        placeholder="Enter your email"
      />

      <FormInput
        label="Password"
        type={isPasswordVisible ? 'text' : 'password'}
        id="password"
        value={formData.password}
        onChange={handleChange}
        required
        showPasswordToggle
        isPasswordVisible={isPasswordVisible}
        onTogglePassword={() => setIsPasswordVisible(!isPasswordVisible)}
        autoComplete="current-password"
        placeholder="Enter your password"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="auth-toggle">
        Don't have an account?{' '}
        <button
          type="button"
          onClick={onToggleAuth}
          className="toggle-link"
        >
          Sign Up
        </button>
      </div>
    </form>
  );
};

export default SignInForm; 