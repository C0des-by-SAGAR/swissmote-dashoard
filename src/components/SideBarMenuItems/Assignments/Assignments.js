import React, { useState, useEffect, useRef } from 'react';
import './Assignments.css';
import { assignmentsService } from '../../../api/services/assignmentsService';
import { toast } from 'react-toastify';
import { activeListingService } from '../../../api/services/activeListingService';
import { candidateService } from '../../../api/services/candidateService';
import { candidateEmailService } from '../../../api/services/candidateEmailService';
import { evaluationService } from '../../../api/services/evaluationService';

const AssignmentCards = ({ assignments, projectName, listingId, onBack, filterBy, searchTerm }) => {
  const [localAssignments, setLocalAssignments] = useState(assignments);
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const replyInputRef = useRef(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [emailData, setEmailData] = useState(null);
  const [loadingEmail, setLoadingEmail] = useState(false);

  const handleChat = (assignmentId) => {
    // Chat functionality implementation
    console.log('Opening chat for assignment:', assignmentId);
  };

  const handleEvaluate = async (assignment) => {
    try {
      const loadingToast = toast.loading('Marking as evaluated...');
      
      await evaluationService.markAsEvaluated(assignment.candidateId, listingId);
      
      // Update local state to reflect the evaluation
      setLocalAssignments(prevAssignments => 
        prevAssignments.map(item => {
          if (item.id === assignment.id) {
            return {
              ...item,
              status: 'evaluated'
            };
          }
          return item;
        })
      );

      toast.update(loadingToast, {
        render: 'Assignment marked as evaluated!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
    } catch (error) {
      toast.error(error.message || 'Failed to mark assignment as evaluated');
    }
  };

  const handleReplyClick = (assignmentId) => {
    setActiveReplyId(activeReplyId === assignmentId ? null : assignmentId);
    // Focus the input field when it appears
    setTimeout(() => {
      replyInputRef.current?.focus();
    }, 0);
  };

  const handleReplySubmit = async (listingNum, candidateId, event) => {
    event.preventDefault();
    const message = event.target.elements.replyMessage.value;

    try {
      setIsSubmitting(true);
      const loadingToast = toast.loading('Sending reply...');

      await candidateService.replyToCandidate(listingNum, candidateId, message);

      toast.update(loadingToast, {
        render: 'Reply sent successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

      // Reset form and close reply field
      event.target.reset();
      setActiveReplyId(null);
    } catch (error) {
      toast.error(error.message || 'Failed to send reply');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReplyCancel = () => {
    setReplyText('');
    setActiveReplyId(null);
  };

  const handleEmail = async (assignment) => {
    try {
      setLoadingEmail(true);
      const loadingToast = toast.loading('Fetching email...');
      
      const data = await candidateEmailService.getCandidateEmail(
        assignment.candidateId,
        assignment.organization // Make sure this is passed from the parent
      );
      
      setEmailData(data);
      setShowEmailModal(true);
      
      toast.dismiss(loadingToast);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingEmail(false);
    }
  };

  const handleCopyEmail = () => {
    if (emailData) {
      navigator.clipboard.writeText(emailData.email)
        .then(() => toast.success('Email copied to clipboard!'))
        .catch(() => toast.error('Failed to copy email'));
    }
  };

  // Filter assignments based on selected filter and search term
  const filteredAssignments = localAssignments.filter(assignment => {
    const matchesFilter = filterBy === 'all' || assignment.status === filterBy.toLowerCase();
    const matchesSearch = searchTerm.trim() === '' || 
      assignment.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  return (
    <div>
      <div className="pv4 ph3">
        <button 
          onClick={onBack}
          className="back-btn mr3 bg-blue bn br3 pa2 flex items-center pointer"
          aria-label="Go back to listings"
        >
          <span className="white hover-white">Back</span>
        </button>
      </div>
      <div className="flex items-baseline mb4">
        <div className="flex items-center">
          <h2 className="f3 fw5 white mv0 ml3">{projectName}</h2>
          <span className="project-id ml2">#{listingId}</span>
        </div>
      </div>
      <div className="assignments-grid">
        {filteredAssignments.map(assignment => (
          <div key={assignment.id} className="assignment-card pa3 br2">
            <div className="flex justify-between items-start mb3">
              <div>
                <h3 className="f4 fw6 white mv0">{assignment.candidateName}</h3>
                <p className="f6 gray mv2">{assignment.company}</p>
              </div>
              <div className={`status-badge ${assignment.status.toLowerCase()}`}>
                {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
              </div>
            </div>
            <div className="details-grid mb3">
              <div className="detail-item">
                <span className="moon-gray">Location:</span>
                <span className="white ml2">{assignment.location}</span>
              </div>
              <div className="detail-item">
                <span className="moon-gray">Experience:</span>
                <span className="white ml2">{assignment.experience}</span>
              </div>
              <div className="detail-item">
                <span className="moon-gray">Received:</span>
                <span className="white ml2">{assignment.receivedDate}</span>
              </div>
              <div className="detail-item">
                <span className="moon-gray">Relocation:</span>
                <span className="white ml2">{assignment.relocation}</span>
              </div>
            </div>
            <div className="action-buttons-container">
              <button
                onClick={() => handleChat(assignment.id)}
                className="action-button chat-btn"
              >
                <span className="button-icon">💬</span>
                Chat
              </button>
              <button
                onClick={() => handleEvaluate(assignment)}
                className="action-button evaluate-btn"
                disabled={assignment.status.toLowerCase() === 'evaluated'}
              >
                <span className="button-icon">✓</span>
                Evaluate
              </button>
              <button
                onClick={() => handleReplyClick(assignment.id)}
                className={`action-button reply-btn ${activeReplyId === assignment.id ? 'active' : ''}`}
              >
                <span className="button-icon">↩</span>
                Reply
              </button>
              <button
                onClick={() => handleEmail(assignment)}
                className="action-button email-btn"
                disabled={loadingEmail}
              >
                <span className="button-icon">✉</span>
                {loadingEmail ? 'Loading...' : 'Email'}
              </button>
            </div>
            <div className="attachments-section mt3 pt3 bt b--dark-gray">
              <h4 className="f6 gray mv2">Attachments</h4>
              <div className="flex flex-wrap">
                {assignment.attachments.map((attachment, index) => (
                  <a
                    key={index}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="attachment-link mr3 mb2"
                  >
                    {attachment.name}
                  </a>
                ))}
              </div>
            </div>
            
            {activeReplyId === assignment.id && (
              <div className="reply-field-container mt3">
                <form onSubmit={(e) => handleReplySubmit(assignment.listingNumber, assignment.candidateId, e)}>
                  <textarea
                    ref={replyInputRef}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="reply-textarea"
                    placeholder="Type your reply..."
                    rows="3"
                    name="replyMessage"
                    required
                    disabled={isSubmitting}
                  />
                  <div className="reply-actions mt2">
                    <button 
                      type="button" 
                      onClick={handleReplyCancel}
                      className="cancel-btn mr2"
                      disabled={isSubmitting}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit"
                      className="submit-btn"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Sending...' : 'Send Reply'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        ))}
        {filteredAssignments.length === 0 && (
          <div className="no-assignments white-60 tc pa4">
            {searchTerm 
              ? `No assignments found matching "${searchTerm}"`
              : `No ${filterBy.toLowerCase()} assignments found`}
          </div>
        )}
      </div>

      {/* Email Modal */}
      {showEmailModal && emailData && (
        <div className="modal-overlay">
          <div className="modal-content br3 bg-white pa4">
            <div className="flex justify-between items-center mb4">
              <h2 className="f3 fw5 dark-gray mv0">Candidate Email</h2>
              <button 
                onClick={() => setShowEmailModal(false)}
                className="close-button bn bg-transparent pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            
            <div className="email-display-container bg-near-white pa3 br2 mb4">
              <p className="email-text blue mv0">{emailData.email}</p>
              <button
                onClick={handleCopyEmail}
                className="copy-button ml3"
                aria-label="Copy email"
              >
                📋
              </button>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowEmailModal(false)}
                className="modal-button-secondary mr3"
              >
                Close
              </button>
              <button
                onClick={handleCopyEmail}
                className="modal-button-primary"
              >
                Copy Email
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Assignments = () => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [assignmentsList, setAssignmentsList] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [filterBy, setFilterBy] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeListings, setActiveListings] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Add useEffect to fetch listings when component mounts
  useEffect(() => {
    fetchActiveListings();
  }, []); // Empty dependency array means this runs once when component mounts

  const fetchAssignments = async (listingId) => {
    try {
      setIsLoading(true);
      const loadingToast = toast.loading('Fetching assignments...');
      
      const { assignments, total } = await assignmentsService.getAssignments(listingId, 'itn');
      
      // Update the assignments list and the count
      setAssignmentsList(prev => ({
        ...prev,
        [listingId]: assignments
      }));

      // Update the active listings with the correct assignment count
      setActiveListings(prevListings => 
        prevListings.map(listing => 
          listing.id === listingId 
            ? { ...listing, assignmentCount: total }
            : listing
        )
      );

      toast.update(loadingToast, {
        render: 'Assignments fetched successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
    } catch (error) {
      console.error('Assignment fetch error:', error);
      toast.error(error.message || 'Failed to fetch assignments');
      setAssignmentsList(prev => ({
        ...prev,
        [listingId]: []
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewAssignments = async (listing) => {
    setSelectedListing(listing);
    if (!assignmentsList[listing.id]) {
      await fetchAssignments(listing.id);
    }
  };

  const handleBack = () => {
    setSelectedListing(null);
  };

  const fetchActiveListings = async () => {
    try {
      setIsLoading(true);
      const listings = await activeListingService.getActiveListings();
      
      if (!Array.isArray(listings)) {
        throw new Error('Invalid listings response');
      }

      // Map initial listings with basic info
      const initialListings = listings.map(listing => ({
        id: listing.id,
        name: listing.name || `Listing #${listing.id}`,
        role: listing.role || 'Role not specified',
        assignmentCount: 0
      }));

      setActiveListings(initialListings);

      // Fetch assignment counts separately
      for (const listing of initialListings) {
        try {
          const { total } = await assignmentsService.getAssignments(listing.id, 'itn', 1, 0);
          
          setActiveListings(prev => 
            prev.map(item => 
              item.id === listing.id 
                ? { ...item, assignmentCount: total }
                : item
            )
          );
        } catch (error) {
          console.error(`Error fetching assignments for listing ${listing.id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      toast.error('Failed to fetch listings');
      setActiveListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Filter listings based on search term
  const filteredListings = activeListings.filter(listing =>
    !searchTerm.trim() ||
    (listing.name && listing.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (listing.role && listing.role.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (listing.id && listing.id.toString().includes(searchTerm))
  );

  return (
    <div className="assignments-container">
      <header className="fixed-header pa4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h1 className="f2 fw5 white mv0">Assignments</h1>
            <div className="flex items-center ml4 gray f6">
              <span className="mr3">
                <span className="status-indicator-dot bg-green mr2"></span>
                Evaluated
              </span>
              <span className="mr3">
                <span className="status-indicator-dot bg-gold mr2"></span>
                Pending
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <select 
              className="custom-dropdown mr3 pa2 bg-dark-gray white bn br2"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              aria-label="Filter assignments"
            >
              <option value="all">All Assignments</option>
              <option value="evaluated">Evaluated</option>
              <option value="pending">Pending</option>
            </select>
            <div className="search-container relative">
              <input
                type="search"
                placeholder={selectedListing ? "Search assignments..." : "Search listings..."}
                className="search-input pa2 pr4 br2 w5"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                aria-label={selectedListing ? "Search assignments" : "Search listings"}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="scrollable-content">
        {isLoading ? (
          <div className="loading-state white-60 tc pa4">
            <span>Loading listings...</span>
          </div>
        ) : selectedListing ? (
          <AssignmentCards 
            assignments={assignmentsList[selectedListing.id] || []}
            projectName={selectedListing.name}
            listingId={selectedListing.id}
            onBack={handleBack}
            filterBy={filterBy}
            searchTerm={searchTerm}
          />
        ) : (
          <>
            <h2 className="f3 fw5 white mv3 ml4">Active Listings</h2>
            <div className="active-listings-grid">
              {filteredListings.length > 0 ? (
                filteredListings.map(listing => (
                  <div 
                    key={listing.id}
                    className="listing-card pa3 mb3 br2"
                  >
                    <div className="flex justify-between items-start mb3">
                      <div>
                        <div className="flex items-baseline mb2">
                          <h3 className="f4 fw6 white mv0">
                            {listing.name || `Listing #${listing.id}`}
                          </h3>
                          <span className="listing-id ml2 f7 moon-gray">
                            #{listing.id}
                          </span>
                        </div>
                        <p className="f6 gray mv0">
                          {listing.role || 'Role not specified'}
                        </p>
                      </div>
                      <div className="assignment-count f6 white-80 bg-dark-blue br2 pa2">
                        {listing.assignmentCount || 0} Assignments
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt3">
                      <button 
                        className="action-btn light-blue-btn white"
                        onClick={() => handleReviewAssignments(listing)}
                      >
                        View Details
                      </button>
                      {(listing.assignmentCount > 0) && (
                        <button 
                          className="action-btn light-green-btn white ml2"
                          onClick={() => handleReviewAssignments(listing)}
                        >
                          Review Assignments
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-listings white-60 tc pa4">
                  {searchTerm 
                    ? `No listings found matching "${searchTerm}"`
                    : 'No active listings found'}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Assignments;
