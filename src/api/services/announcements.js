import { axiosInstance } from '../config';

export const announcementsService = {
  makeAnnouncement: async (data) => {
    try {
      const payload = {
        listing: data.listingId,
        message: data.message
      };

      const response = await axiosInstance.post('/announcement', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAnnouncementStatus: async (requestId) => {
    try {
      const response = await axiosInstance.get(`/announcement_status/${requestId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 