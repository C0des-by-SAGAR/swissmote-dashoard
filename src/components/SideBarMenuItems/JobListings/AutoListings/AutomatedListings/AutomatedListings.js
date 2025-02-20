import React, { useState } from 'react';
import './AutomatedListings.css';
import ListingDetailsModal from './ListingDetailsModal';
import { announcementService } from '../../../../../api/services/announcementService';
import { toast } from 'react-toastify';
import { addAssignmentService } from '../../../../../api/services/addAssignmentService';
import { reviewService } from '../../../../../api/services/reviewService';
import { followupService } from '../../../../../api/services/followupService';

const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
};

const AutomatedListings = ({ listings }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [selectedListingForAssignment, setSelectedListingForAssignment] = useState(null);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [selectedListingForAnnouncement, setSelectedListingForAnnouncement] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedListingForReview, setSelectedListingForReview] = useState(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);
  const [selectedListingForFollowUp, setSelectedListingForFollowUp] = useState(null);
  const [isSubmittingAssignment, setIsSubmittingAssignment] = useState(false);
  const [isSubmittingAnnouncement, setIsSubmittingAnnouncement] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [isSubmittingFollowup, setIsSubmittingFollowup] = useState(false);
  const cardsPerPage = 3;

  // Calculate pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = listings.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(listings.length / cardsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Reset to first page when listings change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [listings]);

  const handleActionClick = (e, index) => {
    e.stopPropagation(); // Prevent card click
    setActiveMenu(activeMenu === index ? null : index);
  };

  // Close menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => setActiveMenu(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleCardClick = (listing) => {
    setSelectedListing(listing);
  };

  const handleCloseModal = () => {
    setSelectedListing(null);
  };

  const getStatusBadgeClass = (status) => {
    return status.toLowerCase() === 'completed' 
      ? 'status-badge completed' 
      : 'status-badge pending';
  };

  const handlePostAssignment = (listing, e) => {
    e.stopPropagation(); // Prevent card click
    setSelectedListingForAssignment(listing);
    setShowAssignmentModal(true);
  };

  const handleCloseAssignmentModal = () => {
    setShowAssignmentModal(false);
    setSelectedListingForAssignment(null);
  };

  const handleSubmitAssignment = async (url) => {
    if (!url?.trim()) {
      toast.error('Please enter a valid assignment URL');
      return;
    }

    try {
      setIsSubmittingAssignment(true);
      const loadingToast = toast.loading('Posting assignment...');

      await addAssignmentService.addAssignment(
        selectedListingForAssignment.listingNumber,
        url.trim()
      );

      toast.update(loadingToast, {
        render: 'Assignment posted successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

      handleCloseAssignmentModal();
    } catch (error) {
      toast.error(error.message || 'Failed to post assignment');
    } finally {
      setIsSubmittingAssignment(false);
    }
  };

  const handleMakeAnnouncement = (listing, e) => {
    e.stopPropagation(); // Prevent card click
    setSelectedListingForAnnouncement(listing);
    setShowAnnouncementModal(true);
  };

  const handleCloseAnnouncementModal = () => {
    setShowAnnouncementModal(false);
    setSelectedListingForAnnouncement(null);
  };

  const handleSubmitAnnouncement = async (message) => {
    if (!message?.trim()) {
      toast.error('Please enter an announcement message');
      return;
    }

    try {
      setIsSubmittingAnnouncement(true);
      await announcementService.makeAnnouncement(selectedListingForAnnouncement.id, message);
      toast.success('Announcement sent successfully');
      handleCloseAnnouncementModal();
    } catch (error) {
      toast.error('Failed to send announcement: ' + error.message);
    } finally {
      setIsSubmittingAnnouncement(false);
    }
  };

  const handleAddReview = (listing, e) => {
    e.stopPropagation(); // Prevent card click
    setSelectedListingForReview(listing);
    setShowReviewModal(true);
  };

  const handleCloseReviewModal = () => {
    setShowReviewModal(false);
    setSelectedListingForReview(null);
  };

  const handleSubmitReview = async (link) => {
    if (!link?.trim()) {
      toast.error('Please enter a valid review link');
      return;
    }

    try {
      setIsSubmittingReview(true);
      const loadingToast = toast.loading('Adding review...');

      await reviewService.addReview(
        selectedListingForReview.listingNumber,
        link.trim()
      );

      toast.update(loadingToast, {
        render: 'Review added successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

      handleCloseReviewModal();
    } catch (error) {
      toast.error(error.message || 'Failed to add review');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleEditFollowUp = (listing, e) => {
    e.stopPropagation(); // Prevent card click
    setSelectedListingForFollowUp(listing);
    setShowFollowUpModal(true);
  };

  const handleCloseFollowUpModal = () => {
    setShowFollowUpModal(false);
    setSelectedListingForFollowUp(null);
  };

  const handleUpdateFollowUp = async (day2Message, day4Message) => {
    try {
      setIsSubmittingFollowup(true);
      const loadingToast = toast.loading('Updating follow-up messages...');

      // Update day 2 follow-up if changed
      if (day2Message !== selectedListingForFollowUp?.day2Followup) {
        await followupService.modifyFollowup(
          selectedListingForFollowUp.listingNumber,
          'd2',
          day2Message
        );
      }

      // Update day 4 follow-up if changed
      if (day4Message !== selectedListingForFollowUp?.day4Followup) {
        await followupService.modifyFollowup(
          selectedListingForFollowUp.listingNumber,
          'd4',
          day4Message
        );
      }

      toast.update(loadingToast, {
        render: 'Follow-up messages updated successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

      handleCloseFollowUpModal();
    } catch (error) {
      toast.error(error.message || 'Failed to update follow-up messages');
    } finally {
      setIsSubmittingFollowup(false);
    }
  };

  return (
    <div className="automated-listings-container">
      <div className="listings-grid">
        {currentCards.map((listing, index) => (
          <div 
            key={index} 
            className="listing-card" 
            onClick={() => handleCardClick(listing)}
          >
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
              <div className="metrics-grid">
                <div className="metric-item">
                  <label>Posted Over</label>
                  <span>{listing.postedOver}</span>
                </div>
                <div className="metric-item">
                  <label>Conversion Rate</label>
                  <span>{listing.conversionRate}</span>
                </div>
              </div>

              <div className="assignments-section">
                <div className="assignments-grid">
                  <div className="assignment-item">
                    <label>Assignments</label>
                    <div className="assignment-stats">
                      <span>Received: {listing.assignments?.received}</span>
                      <span>Sent: {listing.assignments?.sent}</span>
                    </div>
                  </div>
                  <div className="assignment-item">
                    <label>Applications</label>
                    <div className="application-stats">
                      <span>New: {listing.applications?.new}</span>
                      <span>Total: {listing.applications?.total}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="links-section">
                <div className="links-grid">
                  <div className="link-item">
                    <label>Assignment Links</label>
                    <div className="link-list">
                      {listing.assignmentLinks?.map((link, i) => (
                        <a key={i} href={link} target="_blank" rel="noopener noreferrer">
                          Link {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                  <div className="link-item">
                    <label>Review Links</label>
                    <div className="link-list">
                      {listing.reviewLinks?.map((link, i) => (
                        <a key={i} href={link} target="_blank" rel="noopener noreferrer">
                          Link {i + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="messages-section">
                <div className="message-item">
                  <label>Intro Message</label>
                  <p className="truncated-message">
                    {truncateText(listing.messages?.intro)}
                  </p>
                </div>
                <div className="message-item">
                  <label>Assignment Message</label>
                  <p className="truncated-message">
                    {truncateText(listing.messages?.assignment)}
                  </p>
                </div>
                <div className="followup-grid">
                  <div className="followup-item">
                    <label>Day 2 Followup</label>
                    <span className={`status ${listing.messages?.followup?.day2?.status?.toLowerCase()}`}>
                      {listing.messages?.followup?.day2?.status}
                    </span>
                  </div>
                  <div className="followup-item">
                    <label>Day 4 Followup</label>
                    <span className={`status ${listing.messages?.followup?.day4?.status?.toLowerCase()}`}>
                      {listing.messages?.followup?.day4?.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="dates-section">
                <div className="date-item">
                  <label>Expiry Date</label>
                  <span>{listing.dates?.expiry}</span>
                </div>
                <div className="date-item">
                  <label>Created By</label>
                  <span>{listing.createdBy}</span>
                </div>
              </div>

              <div className="automated-by">
                <label>Automated By</label>
                <span>{listing.automatedBy}</span>
              </div>
            </div>

            <div className="card-actions">
              <button 
                className="action-button"
                onClick={(e) => handlePostAssignment(listing, e)}
              >
                Post Assignment
              </button>
              <button 
                className="action-button"
                onClick={(e) => handleMakeAnnouncement(listing, e)}
              >
                Make Announcement
              </button>
            </div>
            <div className='card-actions'> 
              <button 
                className="action-button"
                onClick={(e) => handleAddReview(listing, e)}
              >
                Add Review
              </button>
              <button 
                className="action-button"
                onClick={(e) => handleEditFollowUp(listing, e)}
              >
                Edit Follow-Up Message
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedListing && (
        <ListingDetailsModal
          data={selectedListing}
          onClose={handleCloseModal}
          isLoadingUpdates={false}
          dailyUpdates={null}
        />
      )}

      {showAssignmentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Assignment URL</h2>
              <button className="close-button" onClick={handleCloseAssignmentModal}>×</button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="input-field"
                placeholder="Enter assignment URL"
                disabled={isSubmittingAssignment}
              />
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={handleCloseAssignmentModal}>
                Cancel
              </button>
              <button className="submit-button" onClick={() => handleSubmitAssignment(document.querySelector('.input-field').value)}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showAnnouncementModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Make Announcement</h2>
              <button className="close-button" onClick={handleCloseAnnouncementModal}>×</button>
            </div>
            <div className="modal-body">
              <textarea
                className="input-field"
                placeholder="Enter your announcement"
                rows={4}
                disabled={isSubmittingAnnouncement}
              />
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={handleCloseAnnouncementModal}>
                Cancel
              </button>
              <button className="submit-button" onClick={() => handleSubmitAnnouncement(document.querySelector('textarea').value)}>
                Send Announcement
              </button>
            </div>
          </div>
        </div>
      )}

      {showReviewModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Review</h2>
              <button className="close-button" onClick={handleCloseReviewModal}>×</button>
            </div>
            <div className="modal-body">
              <input
                type="text"
                className="input-field"
                placeholder="Enter review URL"
                disabled={isSubmittingReview}
              />
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={handleCloseReviewModal}>
                Cancel
              </button>
              <button className="submit-button" onClick={() => handleSubmitReview(document.querySelector('.input-field').value)}>
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {showFollowUpModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Follow-Up Message</h2>
              <button className="close-button" onClick={handleCloseFollowUpModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="input-group">
                <label className="input-label">Day 2 Follow-Up</label>
                <textarea
                  className="input-field"
                  defaultValue={selectedListingForFollowUp?.day2Followup}
                  rows={4}
                  disabled={isSubmittingFollowup}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Day 4 Follow-Up</label>
                <textarea
                  className="input-field"
                  defaultValue={selectedListingForFollowUp?.day4Followup}
                  rows={4}
                  disabled={isSubmittingFollowup}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-button" onClick={handleCloseFollowUpModal}>
                Cancel
              </button>
              <button 
                className="submit-button"
                onClick={() => {
                  const day2Input = document.querySelector('.followup-input:first-of-type');
                  const day4Input = document.querySelector('.followup-input:last-of-type');
                  handleUpdateFollowUp(day2Input.value, day4Input.value);
                }}
              >
                Update Message
              </button>
            </div>
          </div>
        </div>
      )}

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
          <p>No automated listings found.</p>
        </div>
      )}
    </div>
  );
};

export default AutomatedListings;