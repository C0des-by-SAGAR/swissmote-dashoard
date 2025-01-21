import React, { useState, useEffect } from 'react';
import ListingsHeader from '../shared/ListingsHeader';
import ActiveListingCard from '../shared/ActiveListingCards';
import { toast } from 'react-toastify';
import { activeListingService } from '../../../../api/services/activeListingService';
import './ActiveListings.css';

const ActiveListings = ({ isSidebarExpanded }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [employmentType, setEmploymentType] = useState('job');
  const [account, setAccount] = useState('pv');
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchActiveListings = async () => {
    try {
      setIsLoading(true);
      const response = await activeListingService.getActiveListings();
      setListings(response || []);
    } catch (error) {
      toast.error('Error fetching active listings');
      console.error('Error:', error);
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveListings();
  }, [employmentType, account]);

  const filteredListings = listings.filter(listing => {
    const matchesSearch = !searchQuery || 
      Object.values(listing).some(val => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
      
    const matchesAccount = 
      (account === 'pv' && listing.organisation === 'Persist Ventures') ||
      (account === 'sa' && listing.organisation === 'Systemic Altruism');

    const matchesEmploymentType = listing.designation === employmentType;

    return matchesSearch && matchesAccount && matchesEmploymentType;
  });

  return (
    <div className={`job-listings-container ${isSidebarExpanded ? '' : 'sidebar-collapsed'}`}>
      <ListingsHeader
        title="Active Listings"
        subtitle="View and manage all active job listings"
        onSearch={setSearchQuery}
        onEmploymentTypeChange={setEmploymentType}
        onAccountChange={setAccount}
      />

      {isLoading ? (
        <div className="job-loading">Loading listings...</div>
      ) : filteredListings.length > 0 ? (
        <div className="job-listings-grid">
          {filteredListings.map((listing) => (
            <ActiveListingCard
              key={listing.listingNo}
              data={listing}
              links={{
                internshala: listing.internshalaLink,
                leader: listing.leaderLink,
                candidate: listing.candidateLink,
                assignment: listing.assignmentLinks
              }}
            />
          ))}
        </div>
      ) : (
        <div className="job-no-results">
          <p>No active listings found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default ActiveListings;
