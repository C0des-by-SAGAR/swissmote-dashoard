import { activeListingService } from './activeListingService';
import { closedListingService } from './closedListingService';
import { autoListingsService } from './autoListingsService';

export const dashboardGraphService = {
  getDashboardGraphData: async () => {
    try {
      // Fetch all required data in parallel
      const [activeListings, closedListings] = await Promise.all([
        activeListingService.getActiveListings(),
        closedListingService.getClosedListings()
      ]);

      // Calculate Follow-up Status
      const followUpData = [
        {
          name: 'Day 2 Sent',
          value: activeListings.filter(listing => listing.followup2?.sent).length
        },
        {
          name: 'Day 2 Pending',
          value: activeListings.filter(listing => !listing.followup2?.sent).length
        },
        {
          name: 'Day 4 Sent',
          value: activeListings.filter(listing => listing.followup4?.sent).length
        },
        {
          name: 'Day 4 Pending',
          value: activeListings.filter(listing => !listing.followup4?.sent).length
        }
      ];

      // Calculate Conversion Rate Distribution
      const allListings = [...activeListings, ...closedListings];
      const conversionData = [
        {
          name: '0-25%',
          value: allListings.filter(listing => listing.conversionRate <= 25).length
        },
        {
          name: '26-50%',
          value: allListings.filter(listing => listing.conversionRate > 25 && listing.conversionRate <= 50).length
        },
        {
          name: '51-75%',
          value: allListings.filter(listing => listing.conversionRate > 50 && listing.conversionRate <= 75).length
        },
        {
          name: '76-100%',
          value: allListings.filter(listing => listing.conversionRate > 75).length
        }
      ];

      // Calculate Review Links Status
      const reviewData = [
        {
          name: 'Reviews Added',
          value: allListings.filter(listing => listing.assignmentLink && listing.assignmentLink.length > 0).length
        },
        {
          name: 'Reviews Pending',
          value: allListings.filter(listing => !listing.assignmentLink || listing.assignmentLink.length === 0).length
        }
      ];

      // Summary data for detailed stats
      const summaryData = {
        followUp: {
          day2: {
            sent: followUpData[0].value,
            pending: followUpData[1].value
          },
          day4: {
            sent: followUpData[2].value,
            pending: followUpData[3].value
          }
        },
        distribution: {
          '0-25%': conversionData[0].value,
          '26-50%': conversionData[1].value,
          '51-75%': conversionData[2].value,
          '76-100%': conversionData[3].value
        },
        reviews: {
          added: reviewData[0].value,
          pending: reviewData[1].value
        }
      };

      return {
        followUpData,
        conversionData,
        reviewData,
        summaryData
      };
    } catch (error) {
      throw new Error('Failed to fetch dashboard graph data');
    }
  }
}; 