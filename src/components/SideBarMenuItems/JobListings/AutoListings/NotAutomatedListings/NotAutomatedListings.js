import React, { useState } from 'react';
import './NotAutomatedListings.css';
import AutomateListingModal from './AutomateListingModal/AutomateListingModal';

const NotAutomatedListings = ({ listings }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 3;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  // Calculate pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = listings.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(listings.length / cardsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAutomate = (listing) => {
    setSelectedListing(listing);
    setIsModalOpen(true);
  };

  const handleModalSubmit = (formData) => {
    // Handle the form submission here
    console.log('Form submitted:', formData);
    setIsModalOpen(false);
  };

  return (
    <div className="not-automated-listings-container">
      <div className="listings-grid">
        {currentCards.map((listing, index) => (
          <div key={index} className="listing-card">
            <div className="card-header">
              <div className="header-content">
                <h2 className="listing-title">{listing.listingName}</h2>
                <p className="listing-number">#{listing.listingNumber}</p>
              </div>
              <div className="organization-info">
                <span className="organization">{listing.organisation}</span>
              </div>
            </div>

            <div className="card-body">
              <div className="info-grid">
                <div className="info-item">
                  <label className="info-label">Employment Type</label>
                  <span className="info-value">{listing.employmentType}</span>
                </div>
                <div className="info-item">
                  <label className="info-label">Expiry Date</label>
                  <span className="info-value">{listing.expiryDate}</span>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <label className="info-label">Created By</label>
                  <span className="info-value">{listing.createdBy || 'N/A'}</span>
                </div>
              </div>
            </div>

            <div className="card-actions">
              <button 
                className="automate-button"
                onClick={() => handleAutomate(listing)}
              >
                Automate
              </button>
            </div>
          </div>
        ))}
      </div>

      {listings.length > cardsPerPage && (
        <div className="pagination">
          <button 
            className="pagination-button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button 
            className="pagination-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {listings.length === 0 && (
        <div className="no-results">
          <p>No listings found.</p>
        </div>
      )}

      <AutomateListingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        listing={selectedListing}
      />
    </div>
  );
};

export default NotAutomatedListings;