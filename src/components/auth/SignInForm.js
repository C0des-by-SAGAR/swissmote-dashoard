import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const SignInForm = () => {
  const [formData, setFormData] = useState({
    username: 'Nitesh',
    password: 'njpass123'
  });

  const { isAuthenticated } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formBody = new URLSearchParams();
      formBody.append('username', formData.username);
      formBody.append('password', formData.password);
      formBody.append('grant_type', 'password');

      // The actual login is handled by AuthContext on mount
      // This form is just for display/testing purposes
      toast.success('Login handled by AuthContext');
    } catch (error) {
      toast.error('Login failed: ' + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-100">
      <div className="mb-4">
        <label htmlFor="username" className="form-label">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="form-control"
          required
        />
      </div>
      <button type="submit" className="btn btn-primary w-100">
        Sign In
      </button>
    </form>
  );
};

export default SignInForm; 