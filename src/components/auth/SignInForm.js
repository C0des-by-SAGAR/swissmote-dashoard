import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../api/services/authService';
import FormInput from './FormInput';
import { toast } from 'react-toastify';

const SignInForm = ({ onToggleAuth }) => {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      const response = await authService.login(formData);
      // Store the access token
      localStorage.setItem('access_token', response.access_token);
      // Update auth context
      await signIn(response);
      toast.success('Successfully signed in!');
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Failed to sign in');
      toast.error('Failed to sign in');
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
        label="Username"
        type="text"
        id="username"
        value={formData.username}
        onChange={handleChange}
        required
        autoComplete="username"
        placeholder="Enter your username"
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