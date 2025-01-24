import { autoListingsService } from './autoListingsService';

export const listingSorterService = {
  getAllSortedListings: async (empType, account) => {
    try {
      // Fetch listings using autoListingsService
      const listings = await autoListingsService.getAutoListings(empType, account);

      // Sort listings into categories
      const sortedListings = {
        automated: [],
        notAutomated: [],
        expired: []
      };

      listings.forEach(listing => {
        // Check if listing is expired
        const expiryDate = new Date(listing.expiryDate);
        const isExpired = expiryDate < new Date();

        if (isExpired) {
          sortedListings.expired.push(listing);
        } else if (listing.isAutomated) {
          // Check for automation status
          sortedListings.automated.push({
            ...listing,
            // Format data for AutomatedListings component
            listingName: listing.title || 'Untitled',
            organization: listing.company || 'Unknown',
            projectName: listing.project || '',
            date: new Date(listing.createdAt).toLocaleDateString(),
            postedOver: listing.postedDays || '0 days',
            conversionRate: listing.conversionRate || 0,
            assignmentsReceived: listing.assignmentsReceived || 0,
            assignmentsSent: listing.assignmentsSent || 0,
            newApplicants: listing.newApplicants || 0,
            totalApplications: listing.totalApplications || 0,
            assignmentLinks: listing.assignmentLinks || [],
            reviewLinks: listing.reviewLinks || [],
            introMessage: listing.introMessage || '',
            assignmentMessage: listing.assignmentMessage || '',
            day2Followup: listing.followup2?.message || '',
            day2Status: listing.followup2?.sent ? 'Completed' : 'Pending',
            day4Followup: listing.followup4?.message || '',
            day4Status: listing.followup4?.sent ? 'Completed' : 'Pending',
            expiryDate: new Date(listing.expiryDate).toLocaleDateString(),
            createdBy: listing.createdBy || 'Unknown',
            automatedBy: listing.automatedBy || 'Unknown'
          });
        } else {
          // Not automated listings
          sortedListings.notAutomated.push({
            ...listing,
            // Format data for NotAutomatedListings component
            listingName: listing.title || 'Untitled',
            listingNumber: listing.id || '',
            organisation: listing.company || 'Unknown',
            employmentType: listing.type || 'Unknown',
            expiryDate: new Date(listing.expiryDate).toLocaleDateString(),
            createdBy: listing.createdBy || 'Unknown'
          });
        }
      });

      return sortedListings;
    } catch (error) {
      throw new Error('Failed to sort listings: ' + error.message);
    }
  }
}; 