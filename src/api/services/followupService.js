import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for managing followup-related operations
 */
export const followupService = {
  /**
   * Modify a followup message
   * @param {Object} data - The followup data
   * @param {string} data.listing - The listing ID
   * @param {string} data.day - The day number ("2" or "4")
   * @param {string} data.followup - The new followup message
   * @returns {Promise<Object>} Response data
   */
  modifyFollowup: async (data) => {
    try {
      const response = await axiosInstance.patch('/modify_followup', {
        listing: data.listing,
        day: data.day,
        followup: data.followup
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 