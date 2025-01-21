import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for evaluated assignment operations
 */
export const evaluatedAssignmentService = {
  /**
   * Get evaluated assignment details
   * @param {Object} params Request parameters
   * @param {number} params.applicant_id - The applicant ID
   * @param {string} params.org - Organization (pv or sa)
   * @returns {Promise<Object>} Evaluated assignment response
   */
  getEvaluatedAssignment: async (params) => {
    try {
      const response = await axiosInstance.get('/evaluated_assignment', {
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