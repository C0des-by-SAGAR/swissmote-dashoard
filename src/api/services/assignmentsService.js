import axios from 'axios';
import { authService } from './authService';

export const assignmentsService = {
  getAssignments: async (listingId, source = 'itn', rowData = 10, offsetData = 0) => {
    try {
      const payload = {
        listing: listingId,
        source: source,
        row_data: rowData,
        offset_data: offsetData
      };

      const response = await axios.post(
        'https://api.swissmote.com/get_assignments',
        payload,
        { headers: authService.getAuthHeaders() }
      );

      // Check if the response indicates the listing isn't automated
      if (response.status === 400 && response.data?.detail === "listing is not automated yet, please automate it first") {
        throw new Error('Listing must be automated before viewing assignments');
      }

      return response.data;
    } catch (error) {
      if (error.response?.status === 400) {
        throw new Error(error.response.data?.detail || 'Failed to fetch assignments');
      }
      throw new Error(error.message || 'Failed to fetch assignments');
    }
  },

  // Helper method for pagination
  getAssignmentsPage: async (listingId, page = 1, itemsPerPage = 10) => {
    const offset = (page - 1) * itemsPerPage;
    return assignmentsService.getAssignments(listingId, 'itn', itemsPerPage, offset);
  }
}; 