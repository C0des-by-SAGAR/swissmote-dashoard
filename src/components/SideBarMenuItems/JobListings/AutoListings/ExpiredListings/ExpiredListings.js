import React, { useState } from 'react';
import './ExpiredListings.css';

// Mock data
const mockExpiredListings = [
  {
    id: 1,
    title: 'Frontend Developer',
    company: 'Tech Corp',
    expiry_date: '2024-01-01'
  },
  // Add more mock data as needed
];

const ExpiredListings = ({ listings }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 3;

  // Calculate pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = listings.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(listings.length / cardsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="expired-listings-container">
      <div className="listings-grid">
        {currentCards.map((listing, index) => (
          <div key={index} className="listing-card">
            <div className="card-header">
              <div className="header-content">
                <h2 className="listing-title">{listing.projectName}</h2>
                <p className="listing-number">#{listing.listingNumber}</p>
              </div>
              <div className="organization-info">
                <span className="organization">{listing.organisation}</span>
              </div>
            </div>

            <div className="card-body">
              <div className="info-grid">
                <div className="info-item">
                  <label className="info-label">Posted Date</label>
                  <span className="info-value">{listing.postedDate}</span>
                </div>
                <div className="info-item">
                  <label className="info-label">Posted Over</label>
                  <span className="info-value">{listing.postedOver}</span>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <label className="info-label">Created By</label>
                  <span className="info-value">{listing.createdBy}</span>
                </div>
                <div className="info-item">
                  <label className="info-label">Automated By</label>
                  <span className="info-value">{listing.automatedBy}</span>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <label className="info-label">Conversion Rate</label>
                  <span className="info-value">{listing.conversionRate}%</span>
                </div>
                <div className="info-item">
                  <label className="info-label">Total Applications</label>
                  <span className="info-value">{listing.totalApplications}</span>
                </div>
              </div>

              <div className="info-grid">
                <div className="info-item">
                  <label className="info-label">Assignments Received</label>
                  <span className="info-value">{listing.assignmentsReceived}</span>
                </div>
                <div className="info-item">
                  <label className="info-label">Assignments Sent</label>
                  <span className="info-value">{listing.assignmentsSent}</span>
                </div>
              </div>

              <div className="links-section">
                <div className="info-item full-width">
                  <label className="info-label">Assignment Links</label>
                  <a href={listing.assignmentLinks} className="link-value" target="_blank" rel="noopener noreferrer">
                    {listing.assignmentLinks}
                  </a>
                </div>
                <div className="info-item full-width">
                  <label className="info-label">Review Links</label>
                  <span className="info-value">{listing.reviewLinks}</span>
                </div>
              </div>
            </div>

            <div className="card-footer">
              <span className="status-badge expired">Expired</span>
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
          <p>No expired listings found.</p>
        </div>
      )}
    </div>
  );
};

export default ExpiredListings;