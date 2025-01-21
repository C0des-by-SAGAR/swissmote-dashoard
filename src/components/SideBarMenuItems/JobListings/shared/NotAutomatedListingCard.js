import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './NotAutomatedListingCard.css';

const NotAutomatedListingCard = ({ data, onAutomationComplete }) => {
  const [isAutomating, setIsAutomating] = useState(false);

  const handleAutomate = async () => {
    try {
      setIsAutomating(true);
      // Mock success
      toast.success('Listing automated successfully!');
      if (onAutomationComplete) {
        onAutomationComplete();
      }
    } catch (error) {
      toast.error('Error automating listing');
    } finally {
      setIsAutomating(false);
    }
  };

  return (
    <div className="listing-card">
      <div className="listing-card-content">
        <div className="listing-card-header">
          <h3 className="listing-title">{data.listingName}</h3>
          <div className="listing-number">#{data.listingNumber}</div>
        </div>

        <div className="listing-details">
          <div className="detail-row">
            <span className="label">Listing Number</span>
            <span className="value">{data.listingNumber}</span>
          </div>
          
          <div className="detail-row">
            <span className="label">Listing Name</span>
            <span className="value">{data.listingName}</span>
          </div>
          
          <div className="detail-row">
            <span className="label">Expiry Date</span>
            <span className="value">{data.expiryDate}</span>
          </div>
          
          <div className="detail-row">
            <span className="label">Created By</span>
            <span className="value">{data.createdBy}</span>
          </div>
          
          <div className="detail-row">
            <span className="label">Organisation</span>
            <span className="value">{data.organisation}</span>
          </div>
          
          <div className="detail-row">
            <span className="label">Employment Type</span>
            <span className="value">{data.employmentType}</span>
          </div>
        </div>

        <div className="card-actions">
          <button 
            className="automate-button"
            onClick={handleAutomate}
            disabled={isAutomating}
          >
            {isAutomating ? 'Automating...' : 'Automate'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotAutomatedListingCard; 