import React from 'react';
import './ListingCard.css';

const ActiveListingCards = ({ data }) => {
  return (
    <div className="job-listing-card">
      <div className="job-listing-header">
        <span className="job-listing-number">#{data.listingNo}</span>
      </div>

      <div className="job-listing-content">
        <div className="job-listing-info">
          <div className="job-info-section">
            <label className="job-info-label">PROJECT NAME</label>
            <h3 className="job-info-value">{data.projectName}</h3>
          </div>

          <div className="job-info-section">
            <label className="job-info-label">DATE</label>
            <span className="job-info-value">{data.date}</span>
          </div>

          <div className="job-info-section">
            <label className="job-info-label">ORGANIZATION</label>
            <span className="job-info-value">{data.organization}</span>
          </div>

          <div className="job-info-section">
            <label className="job-info-label">CREATED BY</label>
            <span className="job-info-value">{data.createdBy}</span>
          </div>

          <div className="job-info-section">
            <label className="job-info-label">CREATED PLATFORM</label>
            <span className="job-info-value">{data.createdPlatform}</span>
          </div>

          <div className="job-info-section">
            <label className="job-info-label">AUTOMATED BY</label>
            <span className="job-info-value">{data.automatedBy}</span>
          </div>

          <div className="job-info-section">
            <label className="job-info-label">AUTOMATED PLATFORM</label>
            <span className="job-info-value">{data.automatedPlatform}</span>
          </div>

          <div className="job-info-section">
            <label className="job-info-label">EXPIRY DATE</label>
            <span className="job-info-value">{data.expiryDate}</span>
          </div>

          <div className="job-info-section">
            <label className="job-info-label">CONVERSION RATE</label>
            <span className="job-info-value conversion-rate">{data.conversionRate}%</span>
          </div>

          <div className="job-info-section">
            <label className="job-info-label">ASSIGNMENT TYPE</label>
            <span className="job-info-value">{data.assignmentType}</span>
          </div>
        </div>

        <div className="job-listing-actions">
          <button 
            className="job-action-button primary"
          >
            Make Announcement
          </button>
          <button 
            className="job-action-button danger"
          >
            Close Listing
          </button>
          <div className="job-links-group">
            <a href={data.links?.internshala} className="job-link">Internshala Link</a>
            <a href={data.links?.leader} className="job-link">Leader Link</a>
            <a href={data.links?.candidate} className="job-link">Candidate Link</a>
            <a href={data.links?.assignment} className="job-link">Assignment Links</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveListingCards; 