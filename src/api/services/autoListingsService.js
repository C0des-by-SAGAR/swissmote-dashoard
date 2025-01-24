import axios from 'axios';
import { authService } from './authService';

export const autoListingsService = {
  getAutoListings: async (empType, account) => {
    try {
      const headers = await authService.getAuthHeaders();
      
      // No need for complex conversions, just use the values directly
      const response = await axios({
        method: 'POST',
        url: 'https://api.swissmote.com/get_auto_listings',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        data: {
          emp_type: empType,    // API expects 'job' or 'internship' directly
          account: account      // API expects 'pv' or 'sa' directly
        }
      });

      return response.data?.automated || [];
    } catch (error) {
      console.error('API Error:', error.response?.data);
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