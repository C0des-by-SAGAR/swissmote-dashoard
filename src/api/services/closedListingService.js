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
  }
}; 