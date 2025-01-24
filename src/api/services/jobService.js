import axios from 'axios';
import { authService } from './authService';

export const jobService = {
  postJob: async (formData) => {
    try {
      // Convert salary strings to numbers and remove any non-numeric characters
      const minSalary = parseInt(formData.minSalary.replace(/[^0-9]/g, '')) || 0;
      const maxSalary = parseInt(formData.maxSalary.replace(/[^0-9]/g, '')) || 0;

      // Ensure skills are properly formatted as an array of strings
      const skills = formData.requiredSkills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);

      const payload = {
        username: "username",
        job_title: formData.jobTitle.trim(),
        min_experience: parseInt(formData.minExperience) || 0,
        skills: skills,
        job_type: formData.workType.toLowerCase(),
        job_part_full: formData.employment === 'Full-Time' ? 'full' : 'part',
        num_position: parseInt(formData.positions) || 1,
        min_salary: minSalary,
        max_salary: maxSalary,
        account: formData.organization,
        post_on_linkedin: false,
        description: formData.jobTitle.trim() // Adding description as it might be required
      };

      // Log the exact payload being sent for debugging
      console.log('Sending payload:', JSON.stringify(payload));

      const response = await axios({
        method: 'POST',
        url: 'https://api.swissmote.com/postJob',
        params: { dev: true },
        data: payload,
        headers: {
          ...authService.getAuthHeaders(),
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      return response.data;
    } catch (error) {
      // Enhanced error logging
      console.error('Job posting error:', {
        error: error.response?.data || error,
        status: error.response?.status,
        payload: JSON.parse(error.config?.data || '{}')
      });
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to post job';
      throw new Error(errorMessage);
    }
  },
  // Other job-related API methods can be added here
};
