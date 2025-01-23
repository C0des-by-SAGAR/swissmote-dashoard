import axios from 'axios';
import { authService } from './authService';

export const automateListingService = {
  automateListing: async (listingData) => {
    try {
      const payload = {
        username: "username", // You might want to get this from user context/auth
        listing: listingData.listingNumber,
        listing_name: listingData.listingName,
        name: listingData.name,
        process: "assignment",
        post_over: listingData.postOver, // "startupathon or normal"
        assignment_link: listingData.assignmentLink,
        assignment_message: listingData.assignmentMessage,
        invite_message: listingData.inviteMessage,
        followup2: listingData.followup2,
        followup4: listingData.followup4,
        designation: listingData.designation,
        active_status: true,
        emp_type: listingData.empType, // "job or itn"
        ctc: listingData.ctc,
        account: listingData.account // "pv or sa"
      };

      const response = await axios.post(
        'https://api.swissmote.com/automateListing',
        payload,
        { headers: authService.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to automate listing');
    }
  }
}; 