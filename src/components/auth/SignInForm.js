import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import FormInput from './FormInput';
import { toast } from 'react-toastify';
import { validateLoginForm } from '../../utils/validation';

const SignInForm = ({ onToggleAuth }) => {
  const { signIn } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = validateLoginForm(formData);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setIsLoading(true);
    setFormErrors({});
    
    try {
      await signIn(formData);
      toast.success('Successfully signed in!');
    } catch (error) {
      console.error('Login error:', error);
      setFormErrors({ 
        general: error.message || 'Failed to sign in. Please check your credentials.' 
      });
      toast.error('Failed to sign in');
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
        label="Username"
        type="text"
        id="username"
        value={formData.username}
        onChange={handleChange}
        error={formErrors.username}
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
        error={formErrors.password}
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
        className="btn-primary w-100"
      >
        {isLoading ? 'Signing in...' : 'Sign In'}
      </button>

      <div className="auth-toggle mt3 tc">
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