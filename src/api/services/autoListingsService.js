import axios from 'axios';
import { authService } from './authService';

export const autoListingsService = {
  getAutoListings: async (empType, account) => {
    try {
      // Convert employment type to match API expectations based on dropdown values
      const employmentType = empType?.toLowerCase() || '';
      const accountType = account?.toLowerCase() || '';

      const headers = authService.getAuthHeaders();

      const response = await axios.post(
        `https://api.swissmote.com/get_auto_listings`,
        {
          params: {
            emp_type: employmentType,
            account: accountType
          },
          headers: {
            ...headers,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (!response.data) {
        throw new Error('No data received from server');
      }

      return response.data.automated || [];
    } catch (error) {
      console.error('API Error:', error);
      if (error.response?.status === 401) {
        throw new Error('Unauthorized. Please check your authentication.');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch auto listings');
    }
  },

  // Helper methods for specific listing types
  getJobListings: async (account) => {
    return autoListingsService.getAutoListings('job', account);
  },

  getInternshipListings: async (account) => {
    return autoListingsService.getAutoListings('internship', account);
  },

  // Specific account methods
  getSAJobListings: async () => {
    return autoListingsService.getJobListings('sa');
  },

  getSAInternshipListings: async () => {
    return autoListingsService.getInternshipListings('sa');
  },

  getPVJobListings: async () => {
    return autoListingsService.getJobListings('pv');
  },

  getPVInternshipListings: async () => {
    return autoListingsService.getInternshipListings('pv');
  }
};