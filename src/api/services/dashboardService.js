import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';
import { activeListingService } from './activeListingService';
import { automatedListingService } from './automatedListingService';

/**
 * Service for dashboard-related API operations
 */
export const dashboardService = {
  /**
   * Fetch all dashboard data
   * @returns {Promise<Object>} Combined dashboard data
   */
  getDashboardData: async () => {
    try {
      // Get active listings and automated listings
      const [activeListings, automatedListings] = await Promise.all([
        activeListingService.getActiveListings(),
        automatedListingService.getDailyUpdates({ limit: 1000 })
      ]);

      // Calculate expired listings from active listings
      const expiredListings = activeListings.filter(listing => 
        listing.expiry_date && new Date(listing.expiry_date) < new Date()
      );

      // Calculate stats for the dashboard header
      const stats = {
        totalJobs: activeListings.length,
        automatedListings: automatedListings.length || 0,
        notAutomatedListings: activeListings.length - (automatedListings.length || 0),
        expiredListings: expiredListings.length
      };

      // Process and combine the data
      const dashboardData = {
        stats,
        followUpData: [
          { 
            name: 'Day 2 Sent', 
            value: automatedListings.followup_stats?.day2_sent || 0 
          },
          { 
            name: 'Day 2 Pending', 
            value: automatedListings.followup_stats?.day2_pending || 0 
          },
          { 
            name: 'Day 4 Sent', 
            value: automatedListings.followup_stats?.day4_sent || 0 
          },
          { 
            name: 'Day 4 Pending', 
            value: automatedListings.followup_stats?.day4_pending || 0 
          }
        ],
        conversionData: [
          { name: '0-25%', value: automatedListings.conversion_stats?.['0-25'] || 0 },
          { name: '26-50%', value: automatedListings.conversion_stats?.['26-50'] || 0 },
          { name: '51-75%', value: automatedListings.conversion_stats?.['51-75'] || 0 },
          { name: '76-100%', value: automatedListings.conversion_stats?.['76-100'] || 0 }
        ],
        reviewData: [
          { 
            name: 'Reviews Added', 
            value: automatedListings.review_stats?.added || 0 
          },
          { 
            name: 'Reviews Pending', 
            value: automatedListings.review_stats?.pending || 0 
          }
        ]
      };

      return dashboardData;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};