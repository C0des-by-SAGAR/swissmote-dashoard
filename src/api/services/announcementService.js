import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for announcement-related API operations
 */
export const announcementService = {
  /**
   * Send an announcement
   * @param {Object} data - The request data
   * @param {number|string} data.listing - The listing ID
   * @param {string} data.message - The announcement message
   * @returns {Promise<Object>} Response data
   */
  doAnnounce: async (data) => {
    try {
      const response = await axiosInstance.post('/announcement', {
        listing: data.listing,
        message: data.message
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 