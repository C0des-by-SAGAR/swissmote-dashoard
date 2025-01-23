import axios from 'axios';
import { authService } from './authService';

export const addAssignmentService = {
  addAssignment: async (listingId, assignmentLink) => {
    try {
      const response = await axios.patch(
        'https://api.swissmote.com/add_assignment',
        {
          listing: listingId,
          link: assignmentLink
        },
        {
          headers: authService.getAuthHeaders()
        }
      );

      if (response.data?.detail?.success === false) {
        throw new Error(response.data.detail.error || 'Failed to add assignment');
      }

      return {
        success: true,
        message: 'Assignment added successfully'
      };
    } catch (error) {
      if (error.response?.data?.detail) {
        const { error: errorMessage, code } = error.response.data.detail;
        if (code === 'LISTING_NOT_FOUND') {
          throw new Error('Listing not found');
        }
        throw new Error(errorMessage || 'Failed to add assignment');
      }
      throw new Error('Failed to add assignment');
    }
  }
}; 