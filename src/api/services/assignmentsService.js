import axios from 'axios';
import { authService } from './authService';

export const assignmentsService = {
  getAssignments: async (listingId, source = 'itn', rowData = 10, offsetData = 0) => {
    try {
      const headers = await authService.getAuthHeaders();
      
      const listing = parseInt(listingId, 10);

      const response = await axios({
        method: 'POST',
        url: 'https://api.swissmote.com/get_assignments',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        data: {
          listing,
          source: "itn",
          row_data: rowData,
          offset_data: offsetData
        }
      });

      // The API returns an array directly, not nested under 'assignments'
      const assignments = Array.isArray(response.data) ? response.data : [];
      
      return {
        assignments: assignments.map((assignment) => ({
          id: assignment.id,
          candidateName: assignment.candidate_name,
          company: assignment.company,
          status: assignment.status || 'pending',
          location: assignment.location,
          experience: assignment.experience,
          receivedDate: assignment.received_date,
          relocation: assignment.relocation,
          attachments: assignment.attachments || [],
          listingNumber: assignment.listing_number,
          candidateId: assignment.candidate_id,
        })),
        total: assignments.length
      };
    } catch (error) {
      console.error('Assignment fetch error:', {
        error,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  getAssignmentsPage: async (listingId, page = 1, itemsPerPage = 10) => {
    const offset = (page - 1) * itemsPerPage;
    return assignmentsService.getAssignments(listingId, 'itn', itemsPerPage, offset);
  }
};
