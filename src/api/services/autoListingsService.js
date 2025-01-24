import axios from 'axios';
import { authService } from './authService';

export const autoListingsService = {
  getAutoListings: async (emp_type, account) => {
    try {
      const headers = await authService.getAuthHeaders();
      
      const response = await axios({
        method: 'POST',
        url: 'https://api.swissmote.com/get_auto_listings',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        params: {
          emp_type,
          account
        }
      });

      return {
        automated: response.data?.automated || [],
        not_automated: response.data?.not_automated || []
      };
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