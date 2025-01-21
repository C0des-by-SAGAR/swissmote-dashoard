import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import FormInput from './FormInput';
import { toast } from 'react-toastify';
import { validateSignupForm } from '../../utils/validation';

const SignUpForm = ({ onToggleAuth }) => {
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateSignupForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    setFormErrors({});

    try {
      // Check internet connection
      if (!navigator.onLine) {
        throw new Error('No internet connection. Please check your network.');
      }

      await signUp(formData);
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Signup error:', error);
      setFormErrors({ 
        general: error.message || 'Failed to create account. Please try again.' 
      });
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    // Clear error when user starts typing
    if (formErrors[id]) {
      setFormErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-100">
      {formErrors.general && (
        <div className="error-message mb3">
          {formErrors.general}
        </div>
      )}

      <FormInput
        label="Full Name"
        type="text"
        id="fullName"
        value={formData.fullName}
        onChange={handleChange}
        error={formErrors.fullName}
        required
        autoComplete="name"
        placeholder="Enter your full name"
      />

      <FormInput
        label="Username"
        type="text"
        id="username"
        value={formData.username}
        onChange={handleChange}
        error={formErrors.username}
        required
        autoComplete="username"
        placeholder="Choose a username"
        pattern="^[a-zA-Z0-9_-]{3,16}$"
        title="Username must be 3-16 characters and can contain letters, numbers, underscores and hyphens"
      />

      <FormInput
        label="Email Address"
        type="email"
        id="email"
        value={formData.email}
        onChange={handleChange}
        error={formErrors.email}
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
        error={formErrors.password}
        required
        showPasswordToggle
        isPasswordVisible={isPasswordVisible}
        onTogglePassword={() => setIsPasswordVisible(!isPasswordVisible)}
        autoComplete="new-password"
        placeholder="Create a password"
        minLength={6}
      />

      <button
        type="submit"
        disabled={isLoading}
        className="btn-primary w-100"
      >
        {isLoading ? 'Creating Account...' : 'Sign Up'}
      </button>

      <div className="auth-toggle mt3 tc">
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