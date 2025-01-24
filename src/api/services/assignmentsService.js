import axios from 'axios';
import { authService } from './authService';

export const assignmentsService = {
  getAssignments: async (listingId, source = 'itn', rowData = 10, offsetData = 0) => {
    try {
      const headers = await authService.getAuthHeaders();
      
      // Ensure listingId is a valid integer
      const listing = parseInt(listingId, 10);

      // Make the API call
      const response = await axios.post(
        'https://api.swissmote.com/get_assignments',
        {
          listing, // Ensure only the number is sent
          source,  // Default to 'itn'
          row_data: rowData,
          offset_data: offsetData
        },
        { headers }
      );

      // Log the response for debugging
      console.log('API Response:', response.data);

      // Validate and return the assignments
      const assignments = response.data?.assignments || []; // Adjust key if the API response differs
      return assignments.map((assignment) => ({
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
        candidateId: assignment.candidate_id,
      }));
    } catch (error) {
      // Log detailed error for debugging
      console.error('Error fetching assignments:', {
        error: error.message,
        response: error.response?.data,
        requestData: { listingId, source, rowData, offsetData },
      });

      // Handle specific error scenarios
      if (error.response?.status === 400) {
        throw new Error('Invalid request. Please check the listing ID and parameters.');
      } else if (error.response?.status === 401) {
        throw new Error('Authentication failed. Please log in again.');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied. You do not have permission to view these assignments.');
      }
      throw new Error('An unexpected error occurred while fetching assignments.');
    }
  },

  getAssignmentsPage: async (listingId, page = 1, itemsPerPage = 10) => {
    const offset = (page - 1) * itemsPerPage;
    return assignmentsService.getAssignments(listingId, 'itn', itemsPerPage, offset);
  }
};
