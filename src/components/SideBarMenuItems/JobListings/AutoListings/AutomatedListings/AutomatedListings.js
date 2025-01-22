import React, { useState, useEffect } from 'react';
import AutomatedListingCard from '../../shared/AutomatedListingCard';
import ListingDetailsModal from './ListingDetailsModal';
import { toast } from 'react-toastify';
import './AutomatedListings.css';
import { automatedListingService } from '../../../../../api/services/automatedListingService';

const AutomatedListings = () => {
  const [automatedListings, setAutomatedListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedListing, setSelectedListing] = useState(null);
  const [dailyUpdates, setDailyUpdates] = useState({});
  const [isLoadingUpdates, setIsLoadingUpdates] = useState(false);

  useEffect(() => {
    const fetchAutomatedListings = async () => {
      try {
        const data = await automatedListingService.getDailyUpdates({
          listing: 'all',
          offset: 0,
          limit: 1000
        });
        setAutomatedListings(data);
      } catch (error) {
        console.error('Error fetching automated listings:', error);
        toast.error('Error fetching automated listings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAutomatedListings();
  }, []);

  useEffect(() => {
    if (selectedListing?.listingId) {
      fetchDailyUpdates(selectedListing.listingId);
    }
  }, [selectedListing]);

  const fetchDailyUpdates = async (listingId) => {
    try {
      setIsLoadingUpdates(true);
      const updates = await automatedListingService.getDailyUpdates({
        listing: listingId
      });
      setDailyUpdates(prev => ({
        ...prev,
        [listingId]: updates
      }));
    } catch (error) {
      toast.error('Error fetching daily updates');
      console.error('Error:', error);
    } finally {
      setIsLoadingUpdates(false);
    }
  };

  const handleViewDetails = (listing) => {
    if (!listing) {
      toast.error('Listing details not available');
      return;
    }
    setSelectedListing(listing);
  };

  const handleCloseModal = () => {
    setSelectedListing(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="automated-container">
      <div className="header-section">
        <div className="title-section">
          <h1 className="main-title">Automated Listings</h1>
          <p className="subtitle">View and manage all automated job listings</p>
        </div>
      </div>

      <div className="listings-grid">
        {automatedListings.map((listing) => (
          <AutomatedListingCard 
            key={`${listing.listingName}-${listing.date}`}
            data={listing}
            onViewDetails={() => handleViewDetails(listing)}
          />
        ))}
      </div>

      {selectedListing && selectedListing.listingName && (
        <ListingDetailsModal 
          data={selectedListing}
          dailyUpdates={dailyUpdates[selectedListing.listingId]}
          isLoadingUpdates={isLoadingUpdates}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default AutomatedListings;