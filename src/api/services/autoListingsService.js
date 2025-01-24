import axios from 'axios';
import { authService } from './authService';

export const autoListingsService = {
  getAutoListings: async (empType, account) => {
    try {
      // Convert employment type to match API expectations based on dropdown values
      const employmentType = empType?.toLowerCase() === 'job' ? 'job' : 
                           empType?.toLowerCase() === 'internship' ? 'internship' : '';
      
      // Convert account type to match API expectations based on dropdown values
      const accountType = account?.toLowerCase() === 'pv' ? 'pv' :
                         account?.toLowerCase() === 'sa' ? 'sa' : '';

      // Use query string format instead of params object
      const response = await axios.get(
        `https://api.swissmote.com/get_auto_listings?emp_type=${employmentType}&account=${accountType}`,
        {
          headers: {
            ...authService.getAuthHeaders(),
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
      if (error.response?.status === 405) {
        console.error('Method not allowed error:', error);
        throw new Error('Invalid API method. Please check the API documentation.');
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