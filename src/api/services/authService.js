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
      const response = await axiosInstance.post('/auth/login', credentials);
      return response.data;
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
      const response = await axiosInstance.post('/auth/register', userData);
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
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 