import axios from 'axios';
import { authService } from './authService';

export const assignmentsService = {
  getAssignments: async (listingId, source = 'itn', rowData = 10, offsetData = 0) => {
    try {
      const headers = await authService.getAuthHeaders();
      
      // Ensure listingId is a string for the API
      const listing = listingId.toString();

      const response = await axios({
        method: 'POST',  // Changed to GET based on network tab
        url: 'https://api.swissmote.com/get_assignments',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        params: {  // Using params instead of data for GET request
          listing,
          source: "itn",
          row_data: rowData,
          offset_data: offsetData
        }
      });

      // Add debug logging
      console.log('Assignment API Response:', response.data);

      const assignments = Array.isArray(response.data) ? response.data : [];
      
      return {
        assignments: assignments.map((assignment) => ({
          id: assignment.id || '',
          candidateName: assignment.candidate_name || 'Unknown',
          company: assignment.company || 'Not specified',
          status: assignment.status || 'pending',
          location: assignment.location || 'Not specified',
          experience: assignment.experience || 'Not specified',
          receivedDate: assignment.received_date || new Date().toISOString(),
          relocation: assignment.relocation || 'Not specified',
          attachments: assignment.attachments || [],
          listingNumber: assignment.listing_number || listing,
          candidateId: assignment.candidate_id || '',
        })),
        total: assignments.length
      };
    } catch (error) {
      console.error('Assignment fetch error:', {
        error,
        response: error.response?.data,
        status: error.response?.status,
        listingId,
        headers: error.response?.headers
      });
      return { assignments: [], total: 0 }; // Return empty result instead of throwing
    }
  },

  getAssignmentsPage: async (listingId, page = 1, itemsPerPage = 10) => {
    const offset = (page - 1) * itemsPerPage;
    return assignmentsService.getAssignments(listingId, 'itn', itemsPerPage, offset);
  }
};
