import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for managing reviews
 */
export const reviewService = {
  /**
   * Add a review
   * @param {Object} data Review data
   * @param {number} data.listing Listing ID
   * @param {string} data.link Review link
   * @returns {Promise<Object>} Response data
   */
  addReview: async (data) => {
    try {
      const response = await axiosInstance.patch('/add_review', data);
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 