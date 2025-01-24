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
            // Format data for AutomatedListings component
            listingName: listing.title || 'Untitled',
            organization: listing.company || 'Unknown',
            projectName: listing.project || '',
            date: new Date(listing.created_at).toLocaleDateString(),
            postedOver: listing.posted_days || '0 days',
            conversionRate: listing.conversion_rate || 0,
            assignmentsReceived: listing.assignments_received || 0,
            assignmentsSent: listing.assignments_sent || 0,
            newApplicants: listing.new_applicants || 0,
            totalApplications: listing.total_applications || 0,
            assignmentLinks: listing.assignment_links || [],
            reviewLinks: listing.review_links || [],
            introMessage: listing.intro_message || '',
            assignmentMessage: listing.assignment_message || '',
            day2Followup: listing.followup_2?.message || '',
            day2Status: listing.followup_2?.sent ? 'Completed' : 'Pending',
            day4Followup: listing.followup_4?.message || '',
            day4Status: listing.followup_4?.sent ? 'Completed' : 'Pending',
            expiryDate: expiryDate.toLocaleDateString(),
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
            // Format data for NotAutomatedListings component
            listingName: listing.title || 'Untitled',
            listingNumber: listing.id || '',
            organisation: listing.company || 'Unknown',
            employmentType: listing.type || 'Unknown',
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