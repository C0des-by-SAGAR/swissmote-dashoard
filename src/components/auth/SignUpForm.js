import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import FormInput from './FormInput';

const SignUpForm = ({ onToggleAuth }) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include' // Include cookies if needed
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: 'An error occurred during sign up'
        }));
        throw new Error(errorData.message || 'Failed to sign up');
      }

      const data = await response.json();
      await signUp(data);
    } catch (error) {
      console.error('Signup error:', error);
      setError(error.message || 'Failed to sign up. Please try again.');
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
        <div className="error-message">
          {error}
        </div>
      )}

      <FormInput
        label="Full Name"
        type="text"
        id="fullName"
        value={formData.fullName}
        onChange={handleChange}
        required
        autoComplete="name"
      />

      <FormInput
        label="Username"
        type="text"
        id="username"
        value={formData.username}
        onChange={handleChange}
        required
        autoComplete="username"
        pattern="^[a-zA-Z0-9_-]{3,16}$"
        title="Username must be 3-16 characters long and can contain letters, numbers, underscores and hyphens"
      />

      <FormInput
        label="Email Address"
        type="email"
        id="email"
        value={formData.email}
        onChange={handleChange}
        required
        autoComplete="email"
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
        autoComplete="new-password"
      />

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary"
      >
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </button>

      <div className="auth-toggle">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onToggleAuth}
          className="toggle-link"
        >
          Sign In
        </button>
      </div>
    </form>
  );
};

export default SignUpForm; 