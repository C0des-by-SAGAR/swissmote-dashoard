import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for candidate email operations
 */
export const candidateEmailService = {
  /**
   * Get candidate email
   * @param {Object} params Request parameters
   * @param {number} params.applicant_id - The applicant ID
   * @param {string} params.org - Organization (pv or sa)
   * @returns {Promise<string>} Email response
   */
  getCandidateEmail: async (params) => {
    try {
      const response = await axiosInstance.get('/candidate_email', {
        params: {
          applicant_id: params.applicant_id,
          org: params.org
        }
      });
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 