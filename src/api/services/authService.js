import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for authentication-related operations
 */
export const authService = {
  /**
   * Login to get access token
   * @param {Object} credentials User credentials
   * @param {string} credentials.username Username
   * @param {string} credentials.password Password
   * @returns {Promise<Object>} Token response
   */
  login: async (credentials) => {
    try {
      const response = await axiosInstance.post('/token', {
        grant_type: 'password',
        username: credentials.username,
        password: credentials.password,
        scope: '',
        client_id: '',
        client_secret: ''
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 