import axios from 'axios';
import { authService } from './authService';

export const autoListingsService = {
  getAutoListings: async (empType, account) => {
    try {
      // Get fresh auth headers
      const headers = await authService.getAuthHeaders();
      
      // Convert employment type to match API expectations
      const employmentType = empType?.toLowerCase() === 'job' ? 'job' : 
                           empType?.toLowerCase() === 'internship' ? 'internship' : '';
      
      // Convert account type to match API expectations
      const accountType = account?.toLowerCase() === 'pv' ? 'pv' :
                         account?.toLowerCase() === 'sa' ? 'sa' : '';

      const response = await axios({
        method: 'POST', // Changed to POST based on API error
        url: 'https://api.swissmote.com/get_auto_listings',
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        data: {  // Send as POST data instead of query params
          emp_type: employmentType,
          account: accountType
        }
      });

      if (!response.data) {
        throw new Error('No data received from server');
      }

      return response.data.automated || [];
    } catch (error) {
      console.error('Full error:', error);
      
      if (error.response?.status === 401) {
        // Handle authentication error
        console.error('Authentication error:', error.response?.data);
        
        // Attempt to refresh token if available
        try {
          await authService.refreshToken();
          // Retry the request once after refreshing token
          return autoListingsService.getAutoListings(empType, account);
        } catch (refreshError) {
          throw new Error('Authentication failed. Please log in again.');
        }
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