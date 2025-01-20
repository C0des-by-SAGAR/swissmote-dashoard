import React from 'react';
import './ListingCard.css';

const ClosedListingCard = ({ data }) => {
  return (
    <div className="listing-card">
      <div className="listing-card-header">
        <span className="listing-number">#{data.listingNo}</span>
      </div>

      <div className="listing-card-content">
        <div className="listing-main-info">
          <div className="info-group">
            <div className="info-section">
              <label>PROJECT</label>
              <span>{data.projectName}</span>
            </div>

            <div className="info-section">
              <label>ORGANISATION</label>
              <span>{data.organisation}</span>
            </div>
          </div>

          <div className="info-group">
            <div className="info-section">
              <label>PROCESS</label>
              <span>{data.process}</span>
            </div>

            <div className="info-section">
              <label>DESIGNATION</label>
              <span>{data.designation}</span>
            </div>
          </div>

          <div className="info-group">
            <div className="info-section">
              <label>DATE</label>
              <span>{data.date}</span>
            </div>

            <div className="info-section">
              <label>CREATED BY</label>
              <span>{data.createdBy}</span>
            </div>
          </div>

          <div className="info-group">
            <div className="info-section">
              <label>CREATED PLATFORM</label>
              <span>{data.createdPlatform}</span>
            </div>

            <div className="info-section">
              <label>AUTOMATED BY</label>
              <span>{data.automatedBy}</span>
            </div>
          </div>

          <div className="info-group">
            <div className="info-section">
              <label>AUTOMATED PLATFORM</label>
              <span>{data.automatedPlatform}</span>
            </div>

            <div className="info-section">
              <label>EXPIRY DATE</label>
              <span>{data.expiryDate}</span>
            </div>
          </div>

          <div className="info-section conversion-rate-section">
            <label>CONVERSION RATE</label>
            <span className="conversion-rate">{data.conversionRate}%</span>
          </div>
        </div>

        <div className="listing-links">
          <a href={data.internshalaLink} className="link">View Applications</a>
          <a href={data.leaderLink} className="link">Leader Bot</a>
          <a href={data.candidateLink} className="link">Candidate Bot</a>
          <a href={data.assignmentLinks} className="link">Loom Recording</a>
        </div>

        <div className="listing-actions">
          <button className="action-button primary">View Details</button>
          <button className="action-button secondary">Edit</button>
        </div>
      </div>
    </div>
  );
};

export default ClosedListingCard; 