import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for listing message-related operations
 */
export const listingMessageService = {
  /**
   * Update listing messages
   * @param {Object} data - The message data
   * @param {number} data.listing_id - The listing ID
   * @param {string} data.assignment - The assignment message
   * @param {string} data.intro - The intro message
   * @returns {Promise<Object>} The response data
   */
  updateListingMessage: async (data) => {
    try {
      const response = await axiosInstance.patch('/update_listing_message', {
        listing_id: data.listing_id,
        assignment: data.assignment,
        intro: data.intro
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 