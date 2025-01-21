import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for user-related operations
 */
export const userService = {
  /**
   * Get current user details
   * @returns {Promise<Object>} User data
   */
  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/users/me/');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 