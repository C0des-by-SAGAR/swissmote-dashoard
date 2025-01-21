import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for assignment-related API operations
 */
export const assignmentService = {
  /**
   * Get assignments with pagination
   * @param {Object} data - The request data
   * @param {number} data.listingId - The listing ID
   * @param {number} [data.row_data=10] - Number of rows per page
   * @param {number} [data.offset_data=0] - Offset for pagination
   * @returns {Promise<Object>} Assignment data
   */
  getAssignments: async (data = {}) => {
    try {
      const response = await axiosInstance.post('/get_assignments', {
        listing: data.listingId,
        source: "itn", // Hardcoded as per requirement
        row_data: data.row_data || 10,
        offset_data: data.offset_data || 0
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 