import { axiosInstance } from './config';

export const chatService = {
  getChatHistory: async (listing, chatId) => {
    try {
      const response = await axiosInstance.post('/get_chat_history', {
        listing,
        chat_id: chatId
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  sendMessage: async (messageData) => {
    try {
      const response = await axiosInstance.post('/send_message', messageData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMessages: async (messageParams) => {
    try {
      const response = await axiosInstance.post('/get_messages', messageParams);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};
