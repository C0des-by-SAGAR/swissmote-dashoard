import axios from 'axios';
import { authService } from './authService';

export const candidateService = {
  replyToCandidate: async (listingNum, candidateId, message) => {
    try {
      const response = await axios.post(
        `https://api.swissmote.com/reply_candidate?listing_num=${listingNum}`,
        {
          candidate_id: candidateId,
          message: message
        },
        {
          headers: authService.getAuthHeaders()
        }
      );

      if (response.data?.success) {
        return {
          success: true,
          message: response.data.message || 'Message sent successfully!'
        };
      }

      throw new Error('Failed to send reply to candidate');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send reply to candidate');
    }
  }
}; 