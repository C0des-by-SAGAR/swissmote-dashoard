import axios from 'axios';
import { authService } from './authService';

export const questionsService = {
  getQuestions: async (listingId, offset = 0, limit = 10) => {
    try {
      const response = await axios.get(
        `https://api.swissmote.com/getQuestions?listing_id=${listingId}&offset=${offset}&limit=${limit}`,
        {
          headers: authService.getAuthHeaders()
        }
      );

      if (!response.data?.success) {
        throw new Error(response.data?.message || 'Failed to fetch questions');
      }

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      if (error.response?.status === 404) {
        return {
          success: true,
          data: {
            questions: [],
            total: 0
          }
        };
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch questions');
    }
  }
}; 