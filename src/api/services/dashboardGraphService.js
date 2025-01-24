import { activeListingService } from './activeListingService';
import { closedListingService } from './closedListingService';
import { autoListingsService } from './autoListingsService';

export const dashboardGraphService = {
  getDashboardGraphData: async () => {
    try {
      // Fetch all required data in parallel
      const [
        activeListings, 
        closedListings,
        saJobData,
        saInternData,
        pvJobData,
        pvInternData
      ] = await Promise.all([
        activeListingService.getActiveListings(),
        closedListingService.getClosedListings(),
        autoListingsService.getSAJobListings(),
        autoListingsService.getSAInternshipListings(),
        autoListingsService.getPVJobListings(),
        autoListingsService.getPVInternshipListings()
      ]);

      // Combine all automated listings
      const autoListings = [
        ...(saJobData.automated || []),
        ...(saInternData.automated || []),
        ...(pvJobData.automated || []),
        ...(pvInternData.automated || [])
      ];

      // Calculate Follow-up Status from auto listings
      const followUpData = [
        {
          name: 'Day 2 Sent',
          value: autoListings.filter(listing => 
            listing.messages?.followup?.day2?.status === 'Completed').length
        },
        {
          name: 'Day 2 Pending',
          value: autoListings.filter(listing => 
            listing.messages?.followup?.day2?.status === 'Pending').length
        },
        {
          name: 'Day 4 Sent',
          value: autoListings.filter(listing => 
            listing.messages?.followup?.day4?.status === 'Completed').length
        },
        {
          name: 'Day 4 Pending',
          value: autoListings.filter(listing => 
            listing.messages?.followup?.day4?.status === 'Pending').length
        }
      ];

      // Calculate Conversion Rate Distribution
      const allListings = [...activeListings, ...closedListings];
      const conversionData = [
        {
          name: '0-25%',
          value: allListings.filter(listing => {
            const rate = parseFloat(listing.conversionRate?.replace('%', '') || '0');
            return rate <= 25;
          }).length
        },
        {
          name: '26-50%',
          value: allListings.filter(listing => {
            const rate = parseFloat(listing.conversionRate?.replace('%', '') || '0');
            return rate > 25 && rate <= 50;
          }).length
        },
        {
          name: '51-75%',
          value: allListings.filter(listing => {
            const rate = parseFloat(listing.conversionRate?.replace('%', '') || '0');
            return rate > 50 && rate <= 75;
          }).length
        },
        {
          name: '76-100%',
          value: allListings.filter(listing => {
            const rate = parseFloat(listing.conversionRate?.replace('%', '') || '0');
            return rate > 75;
          }).length
        }
      ];

      // Calculate Review Links Status
      const reviewData = [
        {
          name: 'Reviews Added',
          value: allListings.filter(listing => 
            listing.reviewLinks && listing.reviewLinks.length > 0).length
        },
        {
          name: 'Reviews Pending',
          value: allListings.filter(listing => 
            !listing.reviewLinks || listing.reviewLinks.length === 0).length
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
      console.error('Graph Data Error:', error);
      throw new Error('Failed to fetch dashboard graph data');
    }
  }
}; 