import { activeListingService } from './activeListingService';
import { closedListingService } from './closedListingService';

export const statsService = {
  getListingsStats: async () => {
    try {
      // Fetch both active and closed listings
      const [activeListings, closedListings] = await Promise.all([
        activeListingService.getActiveListings(),
        closedListingService.getClosedListings()
      ]);

      return {
        activeCount: activeListings.length || 0,
        closedCount: closedListings.length || 0
      };
    } catch (error) {
      throw new Error('Failed to fetch listings statistics');
    }
  }
}; 