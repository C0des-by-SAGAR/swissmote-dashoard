import axios from 'axios';
import { authService } from './authService';

export const announcementService = {
  makeAnnouncement: async (listingId, message) => {
    try {
      const response = await axios.post(
        'https://api.swissmote.com/announcement',
        {
          listing: listingId,
          message: message
        },
        {
          headers: authService.getAuthHeaders()
        }
      );

      // Check if the announcement was successful
      if (response.data?.success && response.data?.status === 'initiated') {
        return {
          success: true,
          requestId: response.data.request_id,
          message: response.data.message
        };
      }

      throw new Error('Failed to initiate announcement');
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to send announcement');
    }
  }
}; 