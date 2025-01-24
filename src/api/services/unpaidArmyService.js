import axios from 'axios';
import { authService } from './authService';

export const unpaidArmyService = {
  postUnpaidInternship: async (formData) => {
    try {
      // Validate required fields
      if (!formData.internshipTitle || !formData.requiredSkills || !formData.positions) {
        throw new Error('Please fill in all required fields');
      }

      const payload = {
        username: "username", // You might want to get this from user context/auth
        job_title: formData.internshipTitle.trim(),
        skills: formData.requiredSkills.split(',').map(skill => skill.trim()).filter(Boolean),
        job_type: formData.workType.toLowerCase(),
        job_part_full: formData.employment === 'Full-Time' ? 'full' : 'part',
        num_position: parseInt(formData.positions, 10),
        duration: parseInt(formData.duration, 10) || 2,
        post_on_linkedin: false
      };

      // Validate transformed data
      if (!payload.skills.length || isNaN(payload.num_position) || payload.num_position < 1) {
        throw new Error('Invalid input data');
      }

      const response = await axios.post(
        'https://api.swissmote.com/unpaidArmy?dev=true',
        payload,
        { headers: authService.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      if (error.response?.status === 422) {
        throw new Error('Invalid data format. Please check all fields and try again.');
      }
      throw new Error(error.response?.data?.message || 'Failed to post unpaid internship');
    }
  }
}; 