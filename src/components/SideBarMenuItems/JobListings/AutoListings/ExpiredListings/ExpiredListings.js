import React, { useState } from 'react';
import ListingsHeader from '../../shared/ListingsHeader';
import ExpiredListingCard from '../../shared/ExpiredListingCard';
import { expiredListingsData } from './expiredListingsData';
import './ExpiredListings.css';

const ExpiredListings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [employmentType, setEmploymentType] = useState('job');
  const [account, setAccount] = useState('pv');

  const filteredListings = expiredListingsData.filter(listing => {
    const matchesSearch = !searchQuery || 
      Object.values(listing).some(val => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
      
    const matchesAccount = 
      (account === 'pv' && listing.createdBy.includes('Persist Ventures')) ||
      (account === 'sa' && listing.createdBy.includes('Systemic Altruism'));

    return matchesSearch && matchesAccount;
  });

  return (
    <div className="expired-listings-container">
      <ListingsHeader
        title="Expired Listings"
        subtitle="View and manage all expired job listings"
        onSearch={setSearchQuery}
        onEmploymentTypeChange={setEmploymentType}
        onAccountChange={setAccount}
      />

      <div className="listings-grid">
        {filteredListings.map((listing) => (
          <ExpiredListingCard 
            key={listing.listingNumber} 
            data={listing} 
          />
        ))}
      </div>

      {filteredListings.length === 0 && (
        <div className="no-results">
          <p>No expired listings found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default ExpiredListings;