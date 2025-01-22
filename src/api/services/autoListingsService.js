import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';
import { activeListingService } from './activeListingService';
import { automatedListingService } from './automatedListingService';

/**
 * Service for auto listings-related API operations
 */
export const autoListingsService = {
  /**
   * Fetch automated and non-automated listings
   * @param {Object} params - Query parameters
   * @param {string} params.emp_type - Employment type (internship/job)
   * @param {string} params.account - Account type (pv/sa)
   * @returns {Promise<Object>} Object containing automated and non-automated listings
   */
  getAutoListings: async (params) => {
    try {
      const response = await axiosInstance.get('/get_auto_listings', {
        params: {
          emp_type: params.emp_type,
          account: params.account
        }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get counts for dashboard by combining active and automated listings
   * @returns {Promise<Object>} Counts of different listing types
   */
  getDashboardCounts: async () => {
    try {
      // Get active listings and automated listings
      const [activeListings, automatedListings] = await Promise.all([
        activeListingService.getActiveListings(),
        automatedListingService.getDailyUpdates({ limit: 1000 }) // Adjust limit as needed
      ]);

      // Calculate counts
      const counts = {
        total: activeListings.length, // Total jobs from active listings
        automated: automatedListings.length || 0,
        notAutomated: activeListings.length - (automatedListings.length || 0),
        expired: activeListings.filter(listing => 
          listing.expiry_date && new Date(listing.expiry_date) < new Date()
        ).length
      };

      return counts;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 