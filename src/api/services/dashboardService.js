import { axiosInstance } from '../config/axiosConfig';
import { handleApiError } from '../utils/errorHandler';
import { autoListingsService } from './autoListingsService';
import { internshipService } from './internshipService';
import { jobService } from './jobService';
import { unpaidInternshipService } from './unpaidInternshipService';
import { automatedListingService } from './automatedListingService';
import { closedListingService } from './closedListingService';

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
      // Fetch all counts in parallel
      const [
        totalJobs,
        automatedCount,
        notAutomatedCount,
        expiredCount
      ] = await Promise.all([
        jobService.getTotalJobsCount(),
        automatedListingService.getAutomatedCount(),
        automatedListingService.getNotAutomatedCount(),
        closedListingService.getExpiredCount()
      ]);

      // Fetch data from all relevant endpoints
      const [
        pvInternships,
        saInternships,
        pvJobs,
        saJobs,
        automatedListings,
        unpaidInternships
      ] = await Promise.all([
        autoListingsService.getAutoListings({ emp_type: 'internship', account: 'pv' }),
        autoListingsService.getAutoListings({ emp_type: 'internship', account: 'sa' }),
        autoListingsService.getAutoListings({ emp_type: 'job', account: 'pv' }),
        autoListingsService.getAutoListings({ emp_type: 'job', account: 'sa' }),
        automatedListingService.getAutomatedListings(),
        unpaidInternshipService.getUnpaidInternships()
      ]);

      // Process and combine the data
      const dashboardData = {
        stats: {
          totalJobs,
          automatedListings: automatedCount,
          notAutomatedListings: notAutomatedCount,
          expiredListings: expiredCount
        },
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
        ],
        summaryData: {
          followUp: {
            day2: {
              sent: automatedListings.followup_stats?.day2_sent || 0,
              pending: automatedListings.followup_stats?.day2_pending || 0
            },
            day4: {
              sent: automatedListings.followup_stats?.day4_sent || 0,
              pending: automatedListings.followup_stats?.day4_pending || 0
            }
          },
          distribution: {
            '0-25%': automatedListings.conversion_stats?.['0-25'] || 0,
            '26-50%': automatedListings.conversion_stats?.['26-50'] || 0,
            '51-75%': automatedListings.conversion_stats?.['51-75'] || 0,
            '76-100%': automatedListings.conversion_stats?.['76-100'] || 0
          },
          reviews: {
            added: automatedListings.review_stats?.added || 0,
            pending: automatedListings.review_stats?.pending || 0
          }
        }
      };

      return dashboardData;
    } catch (error) {
      throw handleApiError(error);
    }
  }
};