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
          },
          transformResponse: [(data) => {
            try {
              // Remove any control characters before parsing JSON
              const cleanData = data.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
              return JSON.parse(cleanData);
            } catch (e) {
              console.error('JSON Parse Error:', e);
              console.log('Raw response:', data);
              return null;
            }
          }]
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
        assignmentLink: listing['Assignment link'] ? 
          (typeof listing['Assignment link'] === 'string' ? 
            JSON.parse(listing['Assignment link'].replace(/[\x00-\x1F\x7F-\x9F]/g, '')) : 
            listing['Assignment link']
          ) : []
      }));
    } catch (error) {
      // Enhanced error handling with logging
      console.error('Full error:', error);
      if (error.response) {
        console.log('Response data:', error.response.data);
        throw new Error(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
      } else if (error.request) {
        throw new Error('No response received from server. Please check your connection.');
      } else {
        throw new Error(`Error setting up request: ${error.message}`);
      }
    }
  }
};