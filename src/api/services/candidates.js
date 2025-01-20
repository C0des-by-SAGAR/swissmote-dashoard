export const candidatesService = {
  // ... existing methods ...

  hireCandidate: async (listingId, applicantData) => {
    try {
      const response = await axiosInstance.post(`/hire_candidate?listing=${listingId}`, {
        applicants: applicantData
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  replyToCandidate: async (listingNum, message) => {
    try {
      const response = await axiosInstance.post(`/reply_candidate?listing_num=${listingNum}`, {
        candidate_id: message.candidateId,
        message: message.content
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 