import React, { useState } from 'react';
import './ListingCard.css';

const ListingCard = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`listing-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="listing-card-header">
        <div className="listing-number">#{data.listingNumber}</div>
        <div className="listing-status">
          {data.status && (
            <span className={`status-badge ${data.status}`}>
              {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
            </span>
          )}
        </div>
      </div>

      <div className="listing-card-content">
        <h3 className="project-name">{data.projectName}</h3>
        
        <div className="listing-info-grid">
          <div className="info-group">
            <label>Posted Date</label>
            <span>{data.dates?.posted}</span>
          </div>
          
          <div className="info-group">
            <label>Posted Over</label>
            <span>{data.dates?.postedOver}</span>
          </div>

          <div className="info-group">
            <label>Created By</label>
            <span>{data.createdBy}</span>
          </div>

          <div className="info-group">
            <label>Automated By</label>
            <span>{data.automatedBy}</span>
          </div>

          <div className="info-group">
            <label>Expiry Date</label>
            <span>{data.dates?.expiry}</span>
          </div>

          <div className="info-group">
            <label>Conversion Rate</label>
            <span className="conversion-rate">{data.conversionRate}</span>
          </div>
        </div>

        <div className="metrics-grid">
          <div className="metric-item">
            <label>Assignments Received</label>
            <span>{data.metrics?.assignmentsReceived}</span>
          </div>
          
          <div className="metric-item">
            <label>Assignments Sent</label>
            <span>{data.metrics?.assignmentsSent}</span>
          </div>
          
          <div className="metric-item">
            <label>New Applicants</label>
            <span>{data.metrics?.newApplicants}</span>
          </div>

          <div className="metric-item">
            <label>Total Applications</label>
            <span>{data.metrics?.totalApplications}</span>
          </div>
        </div>

        <button 
          className="expand-button"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Show Less' : 'Show More'}
        </button>

        {isExpanded && (
          <div className="expanded-content">
            <div className="messages-section">
              <div className="message-group">
                <label>Intro Message</label>
                <p>{data.messages?.intro}</p>
              </div>
              
              <div className="message-group">
                <label>Assignment Message</label>
                <p>{data.messages?.assignment}</p>
              </div>
              
              <div className="message-group">
                <label>Step 2 Following</label>
                <p>{data.following?.step2}</p>
              </div>
              
              <div className="message-group">
                <label>Step 4 Following</label>
                <p>{data.following?.step4}</p>
              </div>
            </div>
          </div>
        )}

        <div className="listing-links">
          {data.assignmentLink && (
            <a 
              href={data.assignmentLink}
              className="link-button assignment"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Assignment
            </a>
          )}
          
          {data.reviewLink && (
            <a 
              href={data.reviewLink}
              className="link-button review"
              target="_blank"
              rel="noopener noreferrer"
            >
              Review Link
            </a>
          )}
        </div>

        <div className="card-actions">
          <button className="action-button edit">Edit</button>
          <button className="action-button delete">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default ListingCard; 