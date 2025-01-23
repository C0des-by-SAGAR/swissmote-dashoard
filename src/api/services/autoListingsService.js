import axios from 'axios';
import { authService } from './authService';

export const autoListingsService = {
  getAutoListings: async (empType, account) => {
    try {
      const response = await axios.get(
        `https://api.swissmote.com/get_auto_listings?emp_type=${empType}&account=${account}`,
        { headers: authService.getAuthHeaders() }
      );
      return response.data.automated || [];
    } catch (error) {
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