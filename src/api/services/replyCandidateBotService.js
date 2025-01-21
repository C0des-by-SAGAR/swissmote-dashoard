import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for bot reply operations
 */
export const replyCandidateBotService = {
  /**
   * Send bot reply to a candidate
   * @param {number} listing - The listing number
   * @param {Object} data - Reply data
   * @param {number} data.chat_id - Chat ID
   * @param {number} data.message_id - Message ID
   * @param {string} data.message - Reply message
   * @returns {Promise<string>} Success message
   */
  replyWithBot: async (listing, data) => {
    try {
      const response = await axiosInstance.post('/reply_candidate_bot', {
        listing,
        chat_id: data.chat_id,
        message_id: data.message_id,
        message: data.message
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 