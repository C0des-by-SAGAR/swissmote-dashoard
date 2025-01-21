import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for authentication-related operations
 */
export const authService = {
  /**
   * Login user
   * @param {Object} credentials User credentials
   * @param {string} credentials.username Username
   * @param {string} credentials.password Password
   * @returns {Promise<Object>} User data with access token
   */
  login: async (credentials) => {
    try {
      // Create form data as the API expects application/x-www-form-urlencoded
      const formData = new URLSearchParams();
      formData.append('username', credentials.username);
      formData.append('password', credentials.password);
      formData.append('grant_type', 'password');
      // Optional fields if needed
      // formData.append('scope', '');
      // formData.append('client_id', '');
      // formData.append('client_secret', '');

      const response = await axiosInstance.post('/token', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      // The API returns access_token and token_type
      return {
        access_token: response.data.access_token,
        token_type: response.data.token_type,
        user: {
          username: credentials.username
        }
      };
    } catch (error) {
      // Handle 401 Unauthorized specifically
      if (error.response?.status === 401) {
        throw new Error('Incorrect username or password');
      }
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
      const response = await axiosInstance.post('/auth/register', {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        full_name: userData.fullName
      });
      return {
        access_token: response.data.access_token,
        user: response.data.user
      };
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
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 