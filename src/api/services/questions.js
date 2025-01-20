import { axiosInstance } from '../config';

export const questionsService = {
  getQuestions: async (listingId) => {
    try {
      const response = await axiosInstance.get(`/questions/${listingId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  replyToQuestion: async (questionId, reply) => {
    try {
      const response = await axiosInstance.post(`/questions/${questionId}/reply`, { reply });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 