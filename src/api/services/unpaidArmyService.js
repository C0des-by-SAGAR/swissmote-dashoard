import axios from 'axios';
import { authService } from './authService';

export const unpaidArmyService = {
  postUnpaidInternship: async (formData) => {
    try {
      const payload = {
        username: "username", // You might want to get this from user context/auth
        job_title: formData.internshipTitle,
        skills: formData.requiredSkills.split(',').map(skill => skill.trim()),
        job_type: formData.workType.toLowerCase(),
        job_part_full: formData.employment === 'Full-Time' ? 'full' : 'part',
        num_position: parseInt(formData.positions),
        duration: parseInt(formData.duration) || 2,
        post_on_linkedin: false
      };

      const response = await axios.post(
        'https://api.swissmote.com/unpaidArmy?dev=true',
        payload,
        { headers: authService.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to post unpaid internship');
    }
  }
}; 