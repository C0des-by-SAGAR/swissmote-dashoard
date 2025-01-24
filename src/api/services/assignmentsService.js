import axios from 'axios';
import { authService } from './authService';

export const assignmentsService = {
  getAssignments: async (listingId, source = 'itn', rowData = 10, offsetData = 0) => {
    try {
      const headers = await authService.getAuthHeaders();
      
      // Ensure listingId is properly formatted
      const listing = parseInt(listingId, 10);

      const response = await axios({
        method: 'POST',
        url: 'https://api.swissmote.com/get_assignments',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: {
          listing,           // Just the number, no additional formatting
          source: "itn",     // Explicitly set as string
          row_data: rowData, // Pagination
          offset_data: offsetData
        }
      });

      // Add debug logging
      console.log('API Response:', {
        status: response.status,
        data: response.data,
        headers: response.headers
      });

      // Check if response is an error message
      if (response.data?.detail) {
        throw new Error(response.data.detail);
      }

      // Ensure response.data is an array
      const assignments = Array.isArray(response.data) ? response.data : [];

      return assignments.map(assignment => ({
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
      // Enhanced error logging
      console.error('Assignment fetch error:', {
        error: error,
        response: error.response?.data,
        status: error.response?.status,
        message: error.message,
        requestData: {
          listing: listingId,
          source: source,
          row_data: rowData,
          offset_data: offsetData
        }
      });

      if (error.response?.status === 400) {
        throw new Error(error.response.data?.detail || 'Invalid request parameters');
      }
      if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      }
      if (error.response?.status === 403) {
        throw new Error('You do not have permission to view these assignments.');
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