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
        post_on_linkedin: false
      };

      const response = await axios.post(
        'https://api.swissmote.com/postJob?dev=true',
        payload,
        {
          headers: {
            ...authService.getAuthHeaders(),
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Job posting error:', {
        error: error.response?.data || error,
        status: error.response?.status,
        payload: error.config?.data
      });
      
      throw new Error(error.response?.data?.message || 'Failed to post job');
    }
  },
  // Other job-related API methods can be added here
};
