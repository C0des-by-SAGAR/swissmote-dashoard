import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';

/**
 * Service for job-related API operations
 */
export const jobService = {
  /**
   * Create a new job posting
   * @param {Object} jobData - The job posting data
   * @param {string} jobData.job_title - Title of the job
   * @param {string} jobData.min_experience - Minimum required experience
   * @param {string} jobData.skills - Required skills
   * @param {string} jobData.min_salary - Minimum salary
   * @param {string} jobData.max_salary - Maximum salary
   * @param {string} jobData.positions - Number of positions
   * @param {string} jobData.account - Account/Organization ID
   * @param {boolean} jobData.post_on_linkedin - Whether to post on LinkedIn
   * @returns {Promise<Object>} The created job data
   */
  createJob: async (jobData) => {
    try {
      const response = await axiosInstance.post('/postJob', {
        job_title: jobData.jobTitle,
        min_experience: jobData.minExperience,
        skills: jobData.requiredSkills,
        min_salary: jobData.minSalary,
        max_salary: jobData.maxSalary,
        positions: jobData.positions,
        account: jobData.organization,
        post_on_linkedin: false // Default to false unless specified
      });
      return response;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  /**
   * Get total jobs count
   * @returns {Promise<number>} Total number of jobs
   */
  getTotalJobsCount: async () => {
    try {
      // Fetch the job count from the appropriate endpoint
      const response = await axiosInstance.get('/jobs/count');
      return response.data.count || 0;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}; 