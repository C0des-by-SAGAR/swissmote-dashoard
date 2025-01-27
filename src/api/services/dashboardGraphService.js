import { activeListingService } from './activeListingService';
import { closedListingService } from './closedListingService';
import { autoListingsService } from './autoListingsService';

export const dashboardGraphService = {
  getDashboardGraphData: async () => {
    try {
      // Fetch all required data in parallel
      const [
        saJobData, 
        saInternData,
        pvJobData,
        pvInternData
      ] = await Promise.all([
        autoListingsService.getSAJobListings(),
        autoListingsService.getSAInternshipListings(),
        autoListingsService.getPVJobListings(),
        autoListingsService.getPVInternshipListings()
      ]);

      // Combine all automated listings
      const autoListings = [
        ...(saJobData?.automated || []),
        ...(saInternData?.automated || []),
        ...(pvJobData?.automated || []),
        ...(pvInternData?.automated || [])
      ];

      // Follow-up Status calculation
      const followUpData = [
        {
          name: 'Day 2 Sent',
          value: autoListings.filter(listing => 
            listing.day2followup?.status === 1
          ).length
        },
        {
          name: 'Day 2 Pending',
          value: autoListings.filter(listing => 
            listing.day2followup?.status === 0
          ).length
        },
        {
          name: 'Day 4 Sent',
          value: autoListings.filter(listing => 
            listing.day4followup?.status === 1
          ).length
        },
        {
          name: 'Day 4 Pending',
          value: autoListings.filter(listing => 
            listing.day4followup?.status === 0
          ).length
        }
      ];

      // Calculate Conversion Rate Distribution
      const conversionData = [
        {
          name: '0-25%',
          value: autoListings.filter(listing => {
            const received = listing.metrics?.assignments_received_count || 0;
            const sent = listing.metrics?.assignments_sent_count || 0;
            const rate = sent > 0 ? (received / sent) * 100 : 0;
            return rate >= 0 && rate <= 25;
          }).length
        },
        {
          name: '26-50%',
          value: autoListings.filter(listing => {
            const received = listing.metrics?.assignments_received_count || 0;
            const sent = listing.metrics?.assignments_sent_count || 0;
            const rate = sent > 0 ? (received / sent) * 100 : 0;
            return rate > 25 && rate <= 50;
          }).length
        },
        {
          name: '51-75%',
          value: autoListings.filter(listing => {
            const received = listing.metrics?.assignments_received_count || 0;
            const sent = listing.metrics?.assignments_sent_count || 0;
            const rate = sent > 0 ? (received / sent) * 100 : 0;
            return rate > 50 && rate <= 75;
          }).length
        },
        {
          name: '76-100%',
          value: autoListings.filter(listing => {
            const received = listing.metrics?.assignments_received_count || 0;
            const sent = listing.metrics?.assignments_sent_count || 0;
            const rate = sent > 0 ? (received / sent) * 100 : 0;
            return rate > 75 && rate <= 100;
          }).length
        }
      ];

      // Review Links Status calculation
      const reviewData = [
        {
          name: 'Reviews Added',
          value: autoListings.filter(listing => 
            Array.isArray(listing.review_link) && 
            listing.review_link.length > 0
          ).length
        },
        {
          name: 'Reviews Pending',
          value: autoListings.filter(listing => {
            const hasNoReviews = !listing.review_link || 
              !Array.isArray(listing.review_link) || 
              listing.review_link.length === 0;
            const hasReceivedAssignments = (listing.metrics?.assignments_received_count || 0) > 0;
            return hasNoReviews && hasReceivedAssignments;
          }).length
        }
      ];

      // Summary data
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
      console.error('Graph Data Error:', error);
      throw new Error('Failed to fetch dashboard graph data');
    }
  }
}; 