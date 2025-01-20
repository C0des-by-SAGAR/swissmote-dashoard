import React, { useState, useEffect } from 'react';
import { listingsService } from '../../../../api/services/listings';
import { toast } from 'react-toastify';
import Announcement from '../../../shared/Announcement';
import ListingMessageEditor from './ListingMessageEditor';
import './ListingCard.css';

const ActiveListingCards = ({ data, onListingClosed }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);
  const [showMessageEditor, setShowMessageEditor] = useState(false);
  const [listingStatus, setListingStatus] = useState(null);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);

  useEffect(() => {
    checkListingStatus();
  }, [data.listingNumber]);

  const checkListingStatus = async () => {
    try {
      setIsCheckingStatus(true);
      const response = await listingsService.getListingStatus({
        listingId: data.listingNumber,
        account: data.organisation === 'Persist Ventures' ? 'pv' : 'sa',
        employmentType: data.employmentType?.toLowerCase() === 'internship' ? 'internship' : 'job'
      });
      setListingStatus(response);
    } catch (error) {
      console.error('Error checking listing status:', error);
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleCloseListing = async () => {
    try {
      setIsClosing(true);
      await listingsService.closeListing(data.listingNumber);
      toast.success('Listing closed successfully');
      if (onListingClosed) {
        onListingClosed(data.listingNumber);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error closing listing');
    } finally {
      setIsClosing(false);
    }
  };

  const getStatusBadgeClass = () => {
    if (isCheckingStatus) return 'status-checking';
    switch (listingStatus) {
      case 'active': return 'status-active';
      case 'closed': return 'status-closed';
      case 'expired': return 'status-expired';
      default: return 'status-unknown';
    }
  };

  return (
    <div className="job-listing-card">
      <div className="job-listing-header">
        <span className="job-listing-number">#{data.listingNumber}</span>
        <span className={`job-status-badge ${getStatusBadgeClass()}`}>
          {isCheckingStatus ? 'Checking...' : listingStatus || 'Unknown'}
        </span>
        <button 
          className="refresh-status-button"
          onClick={checkListingStatus}
          disabled={isCheckingStatus}
        >
          ↻
        </button>
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
            onClick={() => setShowAnnouncement(!showAnnouncement)}
          >
            {showAnnouncement ? 'Hide Announcement' : 'Make Announcement'}
          </button>
          <button 
            className="job-action-button secondary"
            onClick={() => setShowMessageEditor(!showMessageEditor)}
          >
            {showMessageEditor ? 'Hide Messages' : 'Edit Messages'}
          </button>
          <button 
            className="job-action-button danger"
            onClick={handleCloseListing}
            disabled={isClosing || listingStatus === 'closed' || listingStatus === 'expired'}
          >
            {isClosing ? 'Closing...' : 'Close Listing'}
          </button>
          <div className="job-links-group">
            <a href={data.links?.internshala} className="job-link">Internshala Link</a>
            <a href={data.links?.leader} className="job-link">Leader Link</a>
            <a href={data.links?.candidate} className="job-link">Candidate Link</a>
            <a href={data.links?.assignment} className="job-link">Assignment Links</a>
          </div>
        </div>

        {showAnnouncement && (
          <div className="announcement-section mt3">
            <Announcement 
              listingId={data.listingNumber}
              onAnnouncementSent={() => {
                toast.success('Announcement sent successfully');
                setShowAnnouncement(false);
              }}
            />
          </div>
        )}

        {showMessageEditor && (
          <div className="message-editor-section mt3">
            <ListingMessageEditor 
              listingId={data.listingNumber}
              onMessageUpdate={() => {
                toast.success('Messages updated successfully');
                setShowMessageEditor(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveListingCards; 