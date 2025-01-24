import axios from 'axios';
import { authService } from './authService';

export const unpaidArmyService = {
  postUnpaidInternship: async (formData) => {
    try {
      // Enhanced validation with console logging
      console.log('Received formData:', formData);
      
      // Validate and transform data
      const payload = {
        username: "username",
        job_title: formData.internshipTitle?.trim() || '',
        skills: formData.requiredSkills ? formData.requiredSkills.split(',').map(skill => skill.trim()).filter(Boolean) : [],
        job_type: (formData.workType || 'virtual').toLowerCase(),
        job_part_full: (formData.employment === 'Full-Time' ? 'full' : 'part'),
        num_position: Math.max(1, parseInt(formData.positions, 10) || 0),
        duration: Math.max(1, parseInt(formData.duration, 10) || 2),
        post_on_linkedin: false
      };

      console.log('Transformed payload:', payload);

      // Validate payload
      if (!payload.job_title || !payload.skills.length || payload.num_position < 1) {
        console.log('Validation failed:', {
          hasTitle: Boolean(payload.job_title),
          hasSkills: Boolean(payload.skills.length),
          validPosition: payload.num_position >= 1
        });
        throw new Error('Please ensure all fields are properly filled');
      }

      const response = await axios.post(
        'https://api.swissmote.com/unpaidArmy?dev=true',
        payload,
        { headers: authService.getAuthHeaders() }
      );
      
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error details:', error);
      if (error.response?.status === 422) {
        throw new Error('Invalid data format. Please check all fields and try again.');
      }
      throw new Error(error.response?.data?.message || 'Failed to post unpaid internship');
    }
  }
}; 