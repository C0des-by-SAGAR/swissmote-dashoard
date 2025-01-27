import { autoListingsService } from './autoListingsService';

export const listingSorterService = {
  getAllSortedListings: async (empType, account) => {
    try {
      // Fetch listings using autoListingsService
      const listings = await autoListingsService.getAutoListings(empType, account);
      const currentDate = new Date();

      // Sort listings into categories
      const sortedListings = {
        automated: [],
        notAutomated: [],
        expired: []
      };

      // Process automated listings
      if (Array.isArray(listings.automated)) {
        listings.automated.forEach(listing => {
          const expiryDate = new Date(listing.expiry_date);
          const processedListing = {
            listingName: listing.listing_name,
            listingNumber: listing.listing_number,
            projectName: listing.projectname,
            date: listing.date,
            organisation: listing.posted_over || 'Unknown',
            postedOver: listing.posted_over || 'Unknown',
            conversionRate: listing.conversion_rate || '0%',
            assignments: {
              received: `${listing.metrics?.assignments_received_count || 0}/${listing.metrics?.assignments_sent_count || 0}`,
              sent: `${listing.metrics?.assignments_sent_count || 0}/${listing.metrics?.total_applications_count || 0}`
            },
            applications: {
              new: listing.metrics?.total_new_count || 0,
              total: listing.metrics?.total_applications_count || 0
            },
            assignmentLinks: listing.assignment_link || [],
            reviewLinks: listing.review_link || [],
            messages: {
              intro: listing.messages?.intro || '',
              assignment: listing.messages?.assignment || '',
              followup: {
                day2: {
                  message: listing.day2followup?.followup || '',
                  status: listing.day2followup?.status === 1 ? 'Completed' : 'Pending'
                },
                day4: {
                  message: listing.day4followup?.followup || '',
                  status: listing.day4followup?.status === 1 ? 'Completed' : 'Pending'
                }
              }
            },
            dates: {
              expiry: listing.expiry_date,
              created: listing.date
            },
            createdBy: listing.platform_data?.created_by || 'Unknown',
            automatedBy: listing.platform_data?.automated_by || 'Unknown',
            isExpired: expiryDate < currentDate
          };

          if (processedListing.isExpired) {
            sortedListings.expired.push(processedListing);
          } else {
            sortedListings.automated.push(processedListing);
          }
        });
      }

      // Process non-automated listings
      if (Array.isArray(listings.not_automated)) {
        listings.not_automated.forEach(listing => {
          const expiryDate = new Date(listing.expiry_date);
          const processedListing = {
            listingName: listing.listing_name,
            listingNumber: listing.listing_number,
            organisation: 'Not Automated',
            employmentType: empType || 'Unknown',
            expiryDate: listing.expiry_date,
            createdBy: listing.platform_data?.created_by || 'Unknown',
            automatedBy: listing.platform_data?.automated_by || 'N/A',
            isExpired: expiryDate < currentDate
          };

          if (processedListing.isExpired) {
            sortedListings.expired.push(processedListing);
          } else {
            sortedListings.notAutomated.push(processedListing);
          }
        });
      }

      return sortedListings;
    } catch (error) {
      console.error('Sorting error:', error);
      throw new Error('Failed to sort listings: ' + error.message);
    }
  }
}; 