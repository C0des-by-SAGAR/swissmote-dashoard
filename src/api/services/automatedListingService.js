import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for automated listing-related API operations
 */
export const automatedListingService = {
  /**
   * Create a new automated listing
   * @param {Object} listingData - The listing data to be automated
   * @returns {Promise<Object>} The created automated listing
   */
  createAutomatedListing: async (listingData) => {
    try {
      const response = await axiosInstance.post('/automatedListing', {
        username: listingData.username,
        listing: listingData.listing,
        listing_name: listingData.listingName,
        name: listingData.name,
        process: listingData.process,
        post_over: listingData.postOver,
        assignment_link: listingData.assignmentLink,
        invite_message: listingData.inviteMessage,
        followup2: listingData.followup2,
        followup4: listingData.followup4,
        designation: listingData.designation,
        emp_type: listingData.empType,
        ctc: listingData.ctc,
        account: listingData.account
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get automated listings count
   * @returns {Promise<number>} Number of automated listings
   */
  getAutomatedCount: async () => {
    try {
      const response = await axiosInstance.get('/automated_listings/count');
      return response.data.count || 0;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get not automated listings count
   * @returns {Promise<number>} Number of non-automated listings
   */
  getNotAutomatedCount: async () => {
    try {
      const response = await axiosInstance.get('/not_automated_listings/count');
      return response.data.count || 0;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get daily updates for automated listings
   * @param {Object} params - Query parameters
   * @param {string} params.listing - Listing ID
   * @param {number} [params.offset=0] - Offset for pagination
   * @param {number} [params.limit=10] - Limit for pagination
   * @returns {Promise<Object>} Daily updates data
   */
  getDailyUpdates: async ({ listing, offset = 0, limit = 10 }) => {
    try {
      const response = await axiosInstance.get('/getUpdates', {
        params: {
          listing,
          offset,
          limit
        }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 