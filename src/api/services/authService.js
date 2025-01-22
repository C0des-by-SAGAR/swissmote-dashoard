import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for authentication-related operations
 */
export const authService = {
  /**
   * Login user to get access token
   * @returns {Promise<Object>} Access token response
   */
  login: async () => {
    try {
      const formData = new URLSearchParams();
      formData.append('username', 'Nitesh');
      formData.append('password', 'njpass123');
      formData.append('grant_type', 'password');

      const response = await axiosInstance.post('/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });
      
      return {
        access_token: response.data.access_token,
        token_type: response.data.token_type
      };
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Register new user
   * @param {Object} userData User registration data
   * @param {string} userData.fullName Full name
   * @param {string} userData.username Username
   * @param {string} userData.email Email
   * @param {string} userData.password Password
   * @returns {Promise<Object>} Created user data
   */
  register: async (userData) => {
    try {
      const response = await axiosInstance.post('/api/proxy/auth/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        full_name: userData.fullName
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get current user data
   * @returns {Promise<Object>} User data
   */
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/api/proxy/auth/me');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 