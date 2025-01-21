import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for project-related API operations
 */
export const projectService = {
  /**
   * Close a project
   * @param {number} listingId - The ID of the listing to close
   * @returns {Promise<string>} Success message
   */
  closeProject: async (listingId) => {
    try {
      const response = await axiosInstance.patch('/close_project', {
        listing: listingId
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 