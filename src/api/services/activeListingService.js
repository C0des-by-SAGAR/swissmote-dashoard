import axios from 'axios';
import { authService } from './authService';

export const activeListingService = {
  getActiveListings: async () => {
    try {
      const response = await axios.get(
        'https://api.swissmote.com/active_listing',
        {
          headers: authService.getAuthHeaders()
        }
      );

      // Transform the API response to match our component's data structure
      return response.data.map(listing => ({
        id: listing['Listing No'],
        listingName: listing.listing_name,
        projectName: listing['Project Name'],
        organisation: listing.Organisation,
        process: listing.Process,
        designation: listing.Designation,
        date: listing.Date,
        postedOver: listing.posted_over,
        platformData: {
          createdBy: listing.platform_data.created_by,
          createdByPlatform: listing.platform_data.created_by_platform,
          automatedBy: listing.platform_data.automated_by,
          automatedByPlatform: listing.platform_data.automated_by_platform
        },
        expiryAt: listing.expiry_at,
        conversionRate: listing['Conversion Rate'],
        internshalaLink: listing.Internshala,
        leaderLink: listing['Leader link'],
        candidateLink: listing['Candidate link'],
        assignmentLink: JSON.parse(listing['Assignment link'])
      }));
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch active listings');
    }
  }
}; 