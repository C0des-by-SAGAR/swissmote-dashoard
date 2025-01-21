import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for internship-related API operations
 */
export const internshipService = {
  /**
   * Create a new internship posting
   * @param {Object} internshipData - The internship posting data
   * @param {string} internshipData.internshipTitle - Title of the internship
   * @param {string} internshipData.requiredSkills - Required skills
   * @param {string} internshipData.positions - Number of positions
   * @param {string} internshipData.duration - Duration in months
   * @param {string} internshipData.stipend - Stipend amount
   * @param {string} internshipData.workType - Work type (Virtual/On-Site)
   * @param {string} internshipData.employment - Employment type
   * @param {string} internshipData.organization - Organization ID
   * @returns {Promise<Object>} The created internship data
   */
  createInternship: async (internshipData) => {
    try {
      const response = await axiosInstance.post('/postInternship', {
        username: internshipData.organization, // Mapping to API expected format
        job_title: internshipData.internshipTitle,
        job_type: internshipData.workType.toLowerCase(),
        job_post_mail: "true",
        duration: internshipData.duration,
        salary: internshipData.stipend,
        skills: internshipData.requiredSkills,
        post_on_linkedin: false // Default to false unless specified
      });
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 