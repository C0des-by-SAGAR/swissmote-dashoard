import axios from 'axios';
import { authService } from './authService';

export const activeListingService = {
  getActiveListings: async () => {
    try {
      const response = await axios.get(
        'https://api.swissmote.com/active_listing',
        {
          headers: {
            ...authService.getAuthHeaders(),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      // Add error handling for empty or invalid response
      if (!response.data) {
        throw new Error('No data received from the server');
      }

      // Transform the API response to match our component's data structure
      return response.data.map(listing => ({
        id: listing['Listing No'] || '',
        listingName: listing.listing_name || '',
        projectName: listing['Project Name'] || '', 
        organisation: listing.Organisation || '',
        process: listing.Process || '',
        designation: listing.Designation || '',
        date: listing.Date || '',
        postedOver: listing.posted_over || '',
        platformData: {
          createdBy: listing.platform_data?.created_by || '',
          createdByPlatform: listing.platform_data?.created_by_platform || '',
          automatedBy: listing.platform_data?.automated_by || '',
          automatedByPlatform: listing.platform_data?.automated_by_platform || ''
        },
        expiryAt: listing.expiry_at || '',
        conversionRate: listing['Conversion Rate'] || 0,
        internshalaLink: listing.Internshala || '',
        leaderLink: listing['Leader link'] || '',
        candidateLink: listing['Candidate link'] || '',
        assignmentLink: listing['Assignment link'] ? JSON.parse(listing['Assignment link']) : []
      }));
    } catch (error) {
      // Enhanced error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw new Error(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('No response received from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(`Error setting up request: ${error.message}`);
      }
    }
  }
};