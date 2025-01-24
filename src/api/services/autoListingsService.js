import axios from 'axios';
import { authService } from './authService';

export const autoListingsService = {
  getAutoListings: async (empType, account) => {
    try {
      // Convert employment type to match API expectations
      const employmentType = empType === 'All' ? '' : empType.toLowerCase();
      
      // Convert account type to match API expectations
      const accountType = account === 'All' ? '' : account.toLowerCase();

      const response = await axios.get(
        `https://api.swissmote.com/get_auto_listings`,
        {
          params: {
            emp_type: employmentType,
            account: accountType
          },
          headers: authService.getAuthHeaders()
        }
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