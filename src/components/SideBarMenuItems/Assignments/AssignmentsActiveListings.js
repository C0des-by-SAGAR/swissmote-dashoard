import React from 'react';
import './Assignments.css';

const ActiveListingsCard = ({ listing, isSelected, onSelect }) => (
  <div 
    className={`listing-card pa3 mb2 pointer ${isSelected ? 'bg-light-blue' : 'bg-white'}`}
    onClick={() => onSelect(listing)}
  >
    <div className="flex justify-between items-center w-100">
      <div className="flex-auto pr2">
        <h3 className="f5 fw6 mv0 blue truncate">{listing.name}</h3>
      </div>
      <div className="flex-none">
        <span className="f6 bg-light-gray br-pill ph2 pv1">{listing.assignmentCount}</span>
      </div>
    </div>
    <p className="f6 gray mv2 truncate">{listing.role}</p>
    <p className="f7 light-silver mv0">#{listing.id}</p>
  </div>
);

const ActiveListings = ({ selectedListing, onListingSelect, listings }) => {
  const handleListingClick = (listing) => {
    onListingSelect(listing.id, {
      companyName: listing.name,
      role: listing.role
    });
  };

  return (
    <div className="active-listings-container">
      <div className="fixed-header bb b--light-gray">
        <h2 className="f4 fw6 pa3 mb0 white">Active Listings</h2>
      </div>
      <div className="scrollable-content">
        {listings && listings.map((listing) => (
          <ActiveListingsCard
            key={listing.id}
            listing={listing}
            isSelected={selectedListing === listing.id}
            onSelect={handleListingClick}
          />
        ))}
      </div>
    </div>
  );
};

export default ActiveListings;