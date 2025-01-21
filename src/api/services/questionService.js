import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for managing questions
 */
export const questionService = {
  /**
   * Get questions for a specific listing
   * @param {Object} params Query parameters
   * @param {number} params.listing Listing ID
   * @param {number} [params.offset=0] Pagination offset
   * @param {number} [params.limit=10] Pagination limit
   * @returns {Promise<Array>} Array of questions
   */
  getQuestions: async ({ listing, offset = 0, limit = 10 }) => {
    try {
      const response = await axiosInstance.get('/getQuestions', {
        params: {
          listing,
          offset,
          limit
        }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Reply to a question
   * @param {Object} data Reply data
   * @param {number} data.listing Listing ID
   * @param {number} data.chat_id Chat ID
   * @param {number} data.message_id Message ID
   * @param {string} data.message Reply message
   * @returns {Promise<Object>} Response data
   */
  replyQuestion: async (data) => {
    try {
      const response = await axiosInstance.post('/reply_question', {
        listing: data.listing,
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