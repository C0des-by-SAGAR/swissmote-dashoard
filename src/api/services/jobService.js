import axios from 'axios';
import { authService } from './authService';

export const jobService = {
  postJob: async (formData) => {
    try {
      const payload = {
        username: "username", // You might want to get this from user context/auth
        job_title: formData.jobTitle,
        min_experience: parseInt(formData.minExperience) || 0,
        skills: formData.requiredSkills.split(',').map(skill => skill.trim()),
        job_type: formData.workType.toLowerCase(),
        job_part_full: formData.employment === 'Full-Time' ? 'full' : 'part',
        min_position: parseInt(formData.positions),
        min_salary: parseInt(formData.minSalary.replace(/[^0-9]/g, '')),
        max_salary: parseInt(formData.maxSalary.replace(/[^0-9]/g, '')),
        account: formData.organization,
        post_on_linkedin: false
      };

      const response = await axios.post(
        'https://api.swissmote.com/postJob?dev=true',
        payload,
        { headers: authService.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to post job');
    }
  },
  // Other job-related API methods can be added here
};
