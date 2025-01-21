import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for adding assignments
 */
export const addAssignmentService = {
  /**
   * Add a new assignment
   * @param {Object} data Assignment data
   * @param {number} data.listing - Listing ID
   * @param {string} data.link - Assignment link
   * @returns {Promise<Object>} Response with success status and message
   */
  addAssignment: async (data) => {
    try {
      const response = await axiosInstance.patch('/add_assignment', {
        listing: data.listing,
        link: data.link
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 