import React, { useState, useEffect } from 'react';
import ListingsHeader from '../shared/ListingsHeader';
import ClosedListingCard from '../shared/ClosedListingCard';
import { closedListingService } from '../../../../api/services/closedListingService';
import { toast } from 'react-toastify';
import './ClosedListings.css';

const ClosedListings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [employmentType, setEmploymentType] = useState('job');
  const [account, setAccount] = useState('pv');
  const [closedListings, setClosedListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClosedListings = async () => {
      try {
        const data = await closedListingService.getClosedListings();
        setClosedListings(data);
      } catch (error) {
        console.error('Error fetching closed listings:', error);
        toast.error('Error fetching closed listings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClosedListings();
  }, []);

  const filteredListings = closedListings.filter(listing => {
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="closed-listings-container">
      <ListingsHeader
        title="Closed Listings"
        subtitle="View and manage all closed job listings"
        onSearch={setSearchQuery}
        onEmploymentTypeChange={setEmploymentType}
        onAccountChange={setAccount}
      />

      {filteredListings.length > 0 ? (
        <div className="listings-grid">
          {filteredListings.map((listing) => (
            <ClosedListingCard 
              key={listing.listingNo} 
              data={listing} 
            />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <p>No closed listings found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default ClosedListings;
