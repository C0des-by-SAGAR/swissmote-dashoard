import axios from 'axios';
import { authService } from './authService';

export const evaluationService = {
  markAsEvaluated: async (applicantId, listingId) => {
    try {
      const response = await axios.patch(
        `https://api.swissmote.com/mark_eval_internshala`,
        null, // no request body needed
        {
          params: {
            applicant_id: applicantId,
            listing: listingId
          },
          headers: authService.getAuthHeaders()
        }
      );

      if (response.status === 404) {
        throw new Error('No active listing found');
      }

      return {
        success: true,
        message: 'Assignment marked as evaluated successfully'
      };
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('No active listing found');
      }
      throw new Error(error.response?.data?.message || 'Failed to mark assignment as evaluated');
    }
  }
}; 