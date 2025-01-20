import { axiosInstance } from '../config';

export const assignmentsService = {
  getAssignments: async (params) => {
    try {
      const payload = {
        listing: params.listingId,
        source: params.source || "pv or sa",
        new_data: params.newData || 0,
        offset_date: params.offsetDate || 0
      };

      const response = await axiosInstance.post('/get_assignments', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  evaluateAssignment: async (assignmentId, evaluationData) => {
    try {
      const response = await axiosInstance.post(`/assignments/${assignmentId}/evaluate`, evaluationData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  sendReply: async (assignmentId, message) => {
    try {
      const response = await axiosInstance.post(`/assignments/${assignmentId}/reply`, { message });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 