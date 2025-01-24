import axios from 'axios';
import { authService } from './authService';
import { activeListingService } from './activeListingService';

export const questionsService = {
  getQuestions: async (listingId, offset = 0, limit = 1) => {
    try {
      const response = await axios.get(
        `https://api.swissmote.com/getQuestions?listing=${listingId}&offset=${offset}&limit=${limit}`,
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
      if (error.response?.status === 422) {
        // Handle Unprocessable Entity error
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
  },

  // New method to fetch questions for all active listings
  getAllActiveListingsQuestions: async (limit = 10) => {
    try {
      // First get all active listings
      const activeListings = await activeListingService.getActiveListings();
      
      // Fetch questions for each listing in parallel
      const questionsPromises = activeListings.map(listing => 
        questionsService.getQuestions(listing.id, 0, limit)
      );

      const results = await Promise.all(questionsPromises);

      // Combine results with listing information
      return activeListings.map((listing, index) => ({
        listingId: listing.id,
        listingName: listing.listingName,
        questions: results[index]?.data?.questions || [],
        total: results[index]?.data?.total || 0
      }));

    } catch (error) {
      console.error('Error fetching all questions:', error);
      throw new Error('Failed to fetch questions for active listings');
    }
  }
}; 