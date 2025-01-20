import { axiosInstance } from './config';

export const internshipsService = {
  postInternship: async (internshipData) => {
    try {
      const response = await axiosInstance.post('/postInternship', internshipData, {
        params: { dev: true }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getInternshipDetails: async (internshipId) => {
    try {
      const response = await axiosInstance.get(`/internship/${internshipId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
