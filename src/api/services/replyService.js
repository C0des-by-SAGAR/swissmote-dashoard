import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for candidate reply operations
 */
export const replyService = {
  /**
   * Send reply to a candidate
   * @param {number} listing_num - The listing number
   * @param {Object} data - Reply data
   * @param {number} data.candidate_id - Candidate ID
   * @param {string} data.message - Reply message
   * @returns {Promise<string>} Success message
   */
  replyToCandidate: async (listing_num, data) => {
    try {
      const response = await axiosInstance.post('/reply_candidate', {
        listing_num,
        candidate_id: data.candidate_id,
        message: data.message
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 