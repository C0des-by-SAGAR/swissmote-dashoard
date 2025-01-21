import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for closed listing-related operations
 */
export const closedListingService = {
  /**
   * Get all closed listings
   * @returns {Promise<Array>} Array of closed listings
   */
  getClosedListings: async () => {
    try {
      const response = await axiosInstance.get('/closed_listings');
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get expired listings count
   * @returns {Promise<number>} Number of expired listings
   */
  getExpiredCount: async () => {
    try {
      const response = await axiosInstance.get('/expired_listings/count');
      return response.data.count || 0;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 