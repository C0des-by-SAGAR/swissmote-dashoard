import axios from 'axios';
import { authService } from './authService';

export const candidateEmailService = {
  getCandidateEmail: async (applicantId, organization) => {
    try {
      const response = await axios.get(
        `https://api.swissmote.com/candidate_email`,
        {
          params: {
            applicant_id: applicantId,
            org: organization
          },
          headers: authService.getAuthHeaders()
        }
      );

      if (response.status === 404) {
        throw new Error('Email not found');
      }

      if (response.status === 422) {
        throw new Error('Invalid applicant ID or organization');
      }

      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error('Email not found for this candidate');
      }
      if (error.response?.status === 422) {
        throw new Error('Invalid applicant ID or organization');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch candidate email');
    }
  },

  // Helper method to validate organization
  isValidOrg: (org) => {
    return ['pv', 'sa'].includes(org.toLowerCase());
  }
}; 