import React from 'react';
import './Questions.css';

const ActiveListingsCard = ({ listing, isSelected, onSelect }) => (
  <div 
    className={`listing-card pa3 mb2 pointer ${isSelected ? 'bg-light-blue' : 'bg-white'}`}
    onClick={() => onSelect(listing.id)}
  >
    <div className="flex justify-between items-center w-100">
      <div className="flex-auto pr2">
        <h3 className="f5 fw6 mv0 blue">{listing.name}</h3>
      </div>
      <div className="flex-none">
        <span className="f6 bg-light-gray br-pill ph2 pv1">#{listing.id}</span>
      </div>
    </div>
  </div>
);

const QuestionsActiveListings = ({ selectedListing, onListingSelect, listings }) => {
  return (
    <div className="active-listings-container bg-white br3 shadow-1">
      <div className="fixed-header bb b--light-gray">
        <h2 className="f4 fw6 pa3 mb0">Active Listings</h2>
      </div>
      <div className="scrollable-content">
        {listings.map((listing) => (
          <ActiveListingsCard
            key={listing.id}
            listing={listing}
            isSelected={selectedListing === listing.id}
            onSelect={onListingSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionsActiveListings; 