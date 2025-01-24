import { activeListingService } from './activeListingService';
import { closedListingService } from './closedListingService';
import { autoListingsService } from './autoListingsService';

export const dashboardStatsService = {
  getDashboardStats: async () => {
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

      // Calculate total jobs (active + closed)
      const totalJobs = activeListings.length + closedListings.length;

      // Calculate automated listings (combine all automated listings)
      const automatedListings = [
        ...(saJobData.automated || []),
        ...(saInternData.automated || []),
        ...(pvJobData.automated || []),
        ...(pvInternData.automated || [])
      ].length;

      // Calculate not automated listings (total - automated)
      const notAutomatedListings = totalJobs - automatedListings;

      // Calculate expired listings from closed listings
      const expiredListings = closedListings.filter(listing => {
        const expiryDate = new Date(listing.expiryAt);
        return expiryDate < new Date();
      }).length;

      return {
        totalJobs,
        automatedListings,
        notAutomatedListings,
        expiredListings
      };
    } catch (error) {
      console.error('Stats Error:', error);
      throw new Error('Failed to fetch dashboard statistics');
    }
  }
}; 