import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for managing active listings
 */
export const activeListingService = {
  /**
   * Get all active listings
   * @returns {Promise<Array>} Array of active listings
   */
  getActiveListings: async () => {
    try {
      const response = await axiosInstance.get('/active_listing');
      return response.data.map(listing => ({
        id: listing.id.toString(), // Ensure consistent ID format
        name: listing.name,
        role: listing.role || '',
        assignmentCount: listing.assignment_count || 0,
        isSelected: false
      }));
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get active listings for questions
   * @returns {Promise<Array>} Array of simplified active listings for questions
   */
  getActiveListingsForQuestions: async () => {
    try {
      const response = await axiosInstance.get('/active_listing');
      return response.data.map(listing => ({
        id: listing.id,
        name: listing.role || listing.name
      }));
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 