import { axiosInstance } from '../config';

export const messagesService = {
  getMessage: async (messageType) => {
    try {
      const response = await axiosInstance.get('/get_message', {
        params: {
          message: messageType // 'invite_message', 'assignment_message', 'hired_message', 'assignment_message_startupathon'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  setMessage: async (messageType, messageContent) => {
    try {
      const payload = {
        message: messageType // 'invite_message', 'assignment_message', 'hired_message', 'assignment_message_startupathon'
      };

      const response = await axiosInstance.post('/set_message', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 