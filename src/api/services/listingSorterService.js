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
            ...listing,
            // Match the data structure shown in the screenshot
            listingName: listing.listing_name || 'Untitled',
            listingNumber: listing.listing_number || '',
            organisation: listing.organisation || 'Unknown',
            postedOver: `${listing.posted_over || 0} days`,
            conversionRate: `${listing.conversion_rate || 0}%`,
            assignments: {
              received: listing.assignments_received || '0/0',
              sent: listing.assignments_sent || '0/0'
            },
            applications: {
              new: listing.new_applications || 0,
              total: listing.total_applications || 0
            },
            assignmentLinks: listing.assignment_links || [],
            reviewLinks: listing.review_links || [],
            messages: {
              intro: listing.intro_message || '',
              assignment: listing.assignment_message || '',
              followup: {
                day2: {
                  message: listing.day_2_followup || '',
                  status: listing.day_2_status || 'Pending'
                },
                day4: {
                  message: listing.day_4_followup || '',
                  status: listing.day_4_status || 'Pending'
                }
              }
            },
            dates: {
              expiry: expiryDate.toLocaleDateString(),
              created: new Date(listing.created_at).toLocaleDateString()
            },
            createdBy: listing.created_by || 'Unknown',
            automatedBy: listing.automated_by || 'Unknown',
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
            ...listing,
            listingName: listing.listing_name || 'Untitled',
            listingNumber: listing.listing_number || '',
            organisation: listing.organisation || 'Unknown',
            employmentType: listing.employment_type || 'Unknown',
            expiryDate: expiryDate.toLocaleDateString(),
            createdBy: listing.created_by || 'Unknown',
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