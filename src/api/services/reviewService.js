import axios from 'axios';
import { authService } from './authService';

export const reviewService = {
  addReview: async (listingId, reviewLinks) => {
    try {
      const response = await axios.patch(
        'https://api.swissmote.com/add_review',
        {
          listing: listingId,
          link: reviewLinks
        },
        {
          headers: authService.getAuthHeaders()
        }
      );

      if (response.data?.detail?.success === false) {
        throw new Error(response.data.detail.error || 'Failed to add review');
      }

      return {
        success: true,
        message: 'Review added successfully'
      };
    } catch (error) {
      if (error.response?.data?.detail) {
        const { error: errorMessage, code } = error.response.data.detail;
        if (code === 'LISTING_NOT_FOUND') {
          throw new Error('Listing not found');
        }
        throw new Error(errorMessage || 'Failed to add review');
      }
      throw new Error('Failed to add review');
    }
  }
}; 