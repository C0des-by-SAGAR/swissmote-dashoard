import React from 'react';
import './ListingCard.css';

const ExpiredListingCard = ({ data }) => {
  return (
    <div className="listing-card">
      <div className="listing-card-header">
        <span className="listing-number">#{data.listingNumber}</span>
      </div>

      <div className="listing-card-content">
        <div className="listing-main-info">
          <div className="info-section">
            <label>Project Name</label>
            <h3 className="project-name">{data.projectName}</h3>
          </div>

          <div className="info-section">
            <label>Posted Date</label>
            <span>{data.postedDate}</span>
          </div>

          <div className="info-section">
            <label>Posted Over</label>
            <span>{data.postedOver}</span>
          </div>

          <div className="info-section">
            <label>Created By</label>
            <span>{data.createdBy}</span>
          </div>

          <div className="info-section">
            <label>Automated By</label>
            <span>{data.automatedBy}</span>
          </div>

          <div className="info-section">
            <label>Conversion Rate</label>
            <span className="conversion-rate">{data.conversionRate}%</span>
          </div>

          <div className="info-section">
            <label>Assignments Received</label>
            <span>{data.assignmentsReceived}</span>
          </div>

          <div className="info-section">
            <label>Assignments Sent</label>
            <span>{data.assignmentsSent}</span>
          </div>

          <div className="info-section">
            <label>Total Applications</label>
            <span>{data.totalApplications}</span>
          </div>
        </div>

        <div className="listing-actions">
          <div className="links-group">
            <a href={data.assignmentLinks} className="link">Assignment Links</a>
            <a href={data.reviewLinks} className="link">Review Links</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpiredListingCard; 