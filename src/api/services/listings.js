import { axiosInstance } from '../config';

export const listingsService = {
  // Active Listings
  getActiveListings: async () => {
    try {
      const response = await axiosInstance.get('/active_listing');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Automated Listings
  getAutomatedListings: async () => {
    try {
      const response = await axiosInstance.get('/listings/automated');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Not Automated Listings
  getNotAutomatedListings: async () => {
    try {
      const response = await axiosInstance.get('/listings/not-automated');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Expired Listings
  getExpiredListings: async () => {
    try {
      const response = await axiosInstance.get('/listings/expired');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Closed Listings
  getClosedListings: async () => {
    try {
      const response = await axiosInstance.get('/closed_listings');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAutoListings: async (params) => {
    try {
      const response = await axiosInstance.post('/get_auto_listings', null, {
        params: {
          emp_type: params.employmentType, // 'internship' or 'job'
          account: params.account // 'pv' or 'sa'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  automateListing: async (listingData) => {
    try {
      const payload = {
        username: listingData.username,
        listing: {
          name: listingData.listingName,
          project: listingData.projectName,
          process: listingData.process || "assignment",
          assignment_type: listingData.assignmentType || "normal",
          assignment_link: listingData.assignmentLink,
          assignment_message: listingData.assignmentMessage,
          followup1: listingData.followup1,
          followup2: listingData.followup2,
          active_status: true,
          emp_type: listingData.employmentType || "job", // "job" or "in"
          account: listingData.account // "pv" or "sa"
        }
      };

      const response = await axiosInstance.post('/automateListing', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  closeListing: async (listingId) => {
    try {
      const response = await axiosInstance.patch('/close_project', null, {
        params: {
          listing: listingId
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getListingStatus: async (params) => {
    try {
      const payload = {
        listing: params.listingId,
        account: params.account, // 'pv' or 'sa'
        emp_type: params.employmentType // 'internship' or 'job'
      };

      const response = await axiosInstance.post('/listing_status', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateListingMessage: async (params) => {
    try {
      const payload = {
        listing_id: params.listingId,
        assignment: params.assignmentMessage,
        intro: params.introMessage
      };

      const response = await axiosInstance.patch('/update_listing_message', payload);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}; 