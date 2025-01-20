import { axiosInstance } from './config';

export const jobsService = {
  postJob: async (jobData) => {
    try {
      const response = await axiosInstance.post('/postJob', jobData, {
        params: { dev: true }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getActiveListings: async () => {
    try {
      const response = await axiosInstance.get('/active_listing');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getJobDetails: async (jobId) => {
    try {
      const response = await axiosInstance.get(`/job/${jobId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
