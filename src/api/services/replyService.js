import axios from 'axios';
import { authService } from './authService';

export const replyService = {
  replyToQuestion: async (listingId, chatId, messageId, replyText) => {
    try {
      const response = await axios.post(
        `https://api.swissmote.com/reply_question`,
        {
          chat_id: chatId,
          message_id: messageId,
          message: replyText
        },
        {
          params: {
            listing: listingId
          },
          headers: authService.getAuthHeaders()
        }
      );

      if (response.data?.detail === 'No candidate found for this listing') {
        throw new Error('No candidate found for this listing');
      }

      return {
        success: true,
        message: 'Reply sent successfully'
      };
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to send reply');
    }
  }
}; 