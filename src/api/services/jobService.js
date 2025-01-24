import axios from 'axios';
import { authService } from './authService';

export const jobService = {
  postJob: async (formData) => {
    try {
      // Convert salary strings to numbers (remove non-numeric characters)
      const minSalary = parseInt(formData.minSalary.replace(/[^0-9]/g, ''));
      const maxSalary = parseInt(formData.maxSalary.replace(/[^0-9]/g, ''));

      // Format skills array
      const skills = formData.requiredSkills
        .split(',')
        .map(skill => skill.trim())
        .filter(Boolean);

      // Construct payload exactly matching API requirements
      const payload = {
        username: "username",
        job_title: formData.jobTitle.trim(),
        min_experience: parseInt(formData.minExperience) || 0,
        skills: skills,
        job_type: formData.workType.toLowerCase(),
        job_part_full: formData.employment === 'Full-Time' ? 'full' : 'part',
        num_position: parseInt(formData.positions),
        min_salary: minSalary,
        max_salary: maxSalary,
        account: formData.organization, // Already mapped in PostJobs component
        post_on_linkedin: false
      };

      const response = await axios({
        method: 'POST',
        url: 'https://api.swissmote.com/postJob',
        params: { dev: true },
        headers: {
          ...authService.getAuthHeaders(),
          'Content-Type': 'application/json'
        },
        data: payload
      });

      return response.data;
    } catch (error) {
      console.error('Job posting error:', {
        status: error.response?.status,
        data: error.response?.data,
        payload: error.config?.data
      });
      throw new Error(error.response?.data?.message || 'Failed to post job');
    }
  },
  // Other job-related API methods can be added here
};
