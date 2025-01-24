import axios from 'axios';
import { authService } from './authService';

export const assignmentsService = {
  getAssignments: async (listingId, source = 'itn', rowData = 10, offsetData = 0) => {
    try {
      const headers = await authService.getAuthHeaders();
      
      const response = await axios({
        method: 'POST',
        url: 'https://api.swissmote.com/get_assignments',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        data: {
          listing: listingId,
          source: source,      // Keep this as 'itn'
          row_data: rowData,
          offset_data: offsetData
        }
      });

      if (response.data?.detail === "listing is not automated yet, please automate it first") {
        throw new Error('Listing must be automated before viewing assignments');
      }

      // Transform the response data to match the component's expected structure
      return response.data.map(assignment => ({
        id: assignment.id,
        candidateName: assignment.candidate_name,
        company: assignment.company,
        status: assignment.status,
        location: assignment.location,
        experience: assignment.experience,
        receivedDate: assignment.received_date,
        relocation: assignment.relocation,
        attachments: assignment.attachments || [],
        listingNumber: assignment.listing_number,
        candidateId: assignment.candidate_id
      }));

    } catch (error) {
      console.error('Assignment fetch error:', {
        error: error,
        response: error.response?.data,
        status: error.response?.status,
        message: error.message
      });
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