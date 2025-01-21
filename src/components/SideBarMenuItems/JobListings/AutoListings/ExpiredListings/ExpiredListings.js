import React, { useState, useEffect } from 'react';
import ListingsHeader from '../../shared/ListingsHeader';
import ExpiredListingCard from '../../shared/ExpiredListingCard';
import { autoListingsService } from '../../../../../api/services/autoListingsService';
import { toast } from 'react-toastify';
import './ExpiredListings.css';

const ExpiredListings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [account, setAccount] = useState('pv');
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchExpiredListings();
  }, [account]);

  const fetchExpiredListings = async () => {
    try {
      setIsLoading(true);
      const response = await autoListingsService.getExpiredListings({
        account: account.toLowerCase()
      });
      
      setListings(response.expired || []);
    } catch (error) {
      toast.error('Error fetching expired listings');
      console.error('Error:', error);
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredListings = listings.filter(listing => {
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
        onAccountChange={setAccount}
      />

      {isLoading ? (
        <div className="loading-state">
          <p>Loading expired listings...</p>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default ExpiredListings;