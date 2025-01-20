import React, { useState } from 'react';
import { listingsService } from '../../../../api/services/listings';
import { toast } from 'react-toastify';
import './NotAutomatedListingCard.css';

const NotAutomatedListingCard = ({ data, onAutomationComplete }) => {
  const [isAutomating, setIsAutomating] = useState(false);

  const handleAutomate = async () => {
    try {
      setIsAutomating(true);
      await listingsService.automateListing({
        username: 'default_user', // Replace with actual logged-in username
        listingName: data.listingName,
        projectName: data.projectName,
        assignmentLink: data.assignmentLink || 'https://example.com',
        assignmentMessage: 'Please complete the assignment',
        followup1: "Persistence is the twin sister of excellence. One is a matter of quality; the other, a matter of time.\" -Marabel Morgan",
        followup2: "Success seems to be connected with action. Successful people keep moving. They make mistakes, but they dont quit.\" -Conrad Hilton",
        employmentType: data.employmentType?.toLowerCase() === 'internship' ? 'in' : 'job',
        account: data.organisation === 'Persist Ventures' ? 'pv' : 'sa'
      });

      toast.success('Listing automated successfully!');
      if (onAutomationComplete) {
        onAutomationComplete();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error automating listing');
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