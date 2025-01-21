import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for auto listings-related API operations
 */
export const autoListingsService = {
  /**
   * Fetch automated and non-automated listings
   * @param {Object} params - Query parameters
   * @param {string} params.emp_type - Employment type (internship/job)
   * @param {string} params.account - Account type (pv/sa)
   * @returns {Promise<Object>} Object containing automated and non-automated listings
   */
  getAutoListings: async (params) => {
    try {
      const response = await axiosInstance.get('/get_auto_listings', {
        params: {
          emp_type: params.emp_type,
          account: params.account
        }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Fetch expired listings
   * @param {Object} params - Query parameters
   * @param {string} params.account - Account type (pv/sa)
   * @returns {Promise<Array>} Array of expired listings
   */
  getExpiredListings: async (params) => {
    try {
      const response = await axiosInstance.get('/get_auto_listings', {
        params: {
          emp_type: 'expired',
          account: params.account
        }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 