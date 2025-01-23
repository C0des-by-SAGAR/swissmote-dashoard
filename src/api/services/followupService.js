import axios from 'axios';
import { authService } from './authService';

export const followupService = {
  modifyFollowup: async (listingId, day, followupMessage) => {
    try {
      const response = await axios.patch(
        'https://api.swissmote.com/modify_followup',
        {
          listing: listingId,
          day: day, // "d2" or "d4"
          followup: followupMessage
        },
        {
          headers: authService.getAuthHeaders()
        }
      );

      if (response.data?.detail === 'listing not found') {
        throw new Error('Listing not found');
      }

      return {
        success: true,
        message: 'Follow-up message updated successfully'
      };
    } catch (error) {
      if (error.response?.data?.detail === 'listing not found') {
        throw new Error('Listing not found');
      }
      throw new Error(error.response?.data?.detail || 'Failed to update follow-up message');
    }
  }
}; 