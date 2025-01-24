import axios from 'axios';
import { authService } from './authService';

export const internshipService = {
  postInternship: async (formData) => {
    try {
      // Validate organization value
      const accountMap = {
        'org1': 'pv',
        'org2': 'sa'
      };

      const payload = {
        username: "username", // You might want to get this from user context/auth
        job_title: formData.internshipTitle.trim(),
        skills: formData.requiredSkills.split(',').map(skill => skill.trim()),
        job_type: formData.workType.toLowerCase(),
        job_part_full: formData.employment === 'Full-Time' ? 'full' : 'part',
        num_position: parseInt(formData.positions) || 1,
        duration: parseInt(formData.duration) || 2,
        salary: parseInt(formData.stipend.replace(/[^0-9]/g, '')) || 0,
        account: accountMap[formData.organization] || 'sa', // Map to correct account code
        post_on_linkedin: false
      };

      // Validate required fields
      if (!payload.job_title || !payload.skills.length || !payload.num_position || !payload.salary) {
        throw new Error('Please fill in all required fields');
      }

      const response = await axios.post(
        'https://api.swissmote.com/postInternship?dev=true',
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
      throw new Error(error.response?.data?.message || 'Failed to post internship');
    }
  }
}; 