import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for unpaid internship-related API operations
 */
export const unpaidInternshipService = {
  /**
   * Create a new unpaid internship posting
   * @param {Object} internshipData - The unpaid internship posting data
   * @param {string} internshipData.internshipTitle - Title of the internship
   * @param {string} internshipData.requiredSkills - Required skills
   * @param {string} internshipData.positions - Number of positions
   * @param {string} internshipData.duration - Duration in months
   * @param {string} internshipData.workType - Work type (Virtual/On-Site)
   * @param {string} internshipData.employment - Employment type
   * @returns {Promise<Object>} The created unpaid internship data
   */
  createUnpaidInternship: async (internshipData) => {
    try {
      const response = await axiosInstance.post('/unpaidArmy', {
        username: "systemicaltruism", // Fixed for Systemic Altruism
        job_title: internshipData.internshipTitle,
        skills: internshipData.requiredSkills,
        job_type: internshipData.workType.toLowerCase(),
        min_position: internshipData.positions,
        duration: internshipData.duration,
        post_on_linkedin: false // Default to false unless specified
      });
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 