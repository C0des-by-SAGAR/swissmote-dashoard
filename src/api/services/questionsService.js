import axios from 'axios';
import { authService } from './authService';

export const questionsService = {
  getQuestions: async (listingId, offset = 0, limit = 10) => {
    try {
      const response = await axios.get(
        `https://api.swissmote.com/getQuestions`,
        {
          params: {
            listing: listingId,
            offset,
            limit
          },
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
      throw new Error(error.response?.data?.message || 'Failed to fetch questions');
    }
  }
}; 