import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { announcementService } from '../../../../api/services/announcementService';
import ListingDetailsModal from '../AutoListings/AutomatedListings/ListingDetailsModal';
import { listingDetailsData } from '../AutoListings/AutomatedListings/listingsDetailsData';
import { followupService } from '../../../../api/services/followupService';

const AutomatedListingCard = ({ data, onViewDetails }) => {
  const [showInviteTemplate, setShowInviteTemplate] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [inviteMessage, setInviteMessage] = useState('');
  const [isAnnouncing, setIsAnnouncing] = useState(false);
  const [isEditingFollowup, setIsEditingFollowup] = useState(false);
  const [followupType, setFollowupType] = useState('');
  const [followupMessage, setFollowupMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Add null check
  if (!data) {
    return null;
  }

  const handleSendInvite = async () => {
    try {
      // Your send invite logic here using the inviteMessage state
      toast.success('Invite sent successfully');
      setShowInviteTemplate(false);
    } catch (error) {
      toast.error('Error sending invite');
    }
  };

  const handleAnnounce = async () => {
    try {
      setIsAnnouncing(true);
      await announcementService.doAnnounce({
        listing: data.listingId,
        message: "New announcement"
      });
      toast.success('Announcement sent successfully');
    } catch (error) {
      console.error('Announcement error:', error);
      toast.error('Failed to send announcement: ' + error.message);
    } finally {
      setIsAnnouncing(false);
    }
  };

  // Add the missing handlers
  const handleAssignmentLinks = () => {
    // Implement assignment links logic here
    console.log('Assignment links clicked for listing:', data.listingId);
  };

  const handleReviewLinks = () => {
    // Implement review links logic here
    console.log('Review links clicked for listing:', data.listingId);
  };

  const handleModifyFollowup = async (type, message) => {
    try {
      setIsUpdating(true);
      await followupService.modifyFollowup({
        listing: data.listingId,
        day: type === 'day2' ? '2' : '4',
        followup: message
      });
      
      toast.success(`Day-${type === 'day2' ? '2' : '4'} followup updated successfully`);
      setIsEditingFollowup(false);
      setFollowupMessage('');
    } catch (error) {
      toast.error('Error updating followup: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <div className="listing-card br4 shadow-1 w-100 overflow-hidden bg-white">
        <div className="listing-header bg-dark-blue pa3 bb b--black-10">
          <span className="listing-hash white-80 f5 fw5">#</span>
        </div>

        <div className="listing-content pa4">
          {/* Top Row */}
          <div className="info-row flex flex-wrap justify-between items-start mb4">
            <div className="info-group w-auto pr4 mb3">
              <div className="label silver f7 fw5 ttu tracked mb1">Listing Name</div>
              <div className="value near-black f6 fw5">{data.listingName}</div>
            </div>
            <div className="info-group w-auto pr4 mb3">
              <div className="label silver f7 fw5 ttu tracked mb1">Project Name</div>
              <div className="value near-black f6 fw5">{data.projectName}</div>
            </div>
            <div className="info-group w-auto pr4 mb3">
              <div className="label silver f7 fw5 ttu tracked mb1">Date</div>
              <div className="value near-black f6 fw5">{data.date}</div>
            </div>
            <div className="info-group w-auto pr4 mb3">
              <div className="label silver f7 fw5 ttu tracked mb1">Posted Over</div>
              <div className="value near-black f6 fw5">{data.postedOver}</div>
            </div>
            <div className="info-group w-auto mb3">
              <div className="label silver f7 fw5 ttu tracked mb1">Expiry Date</div>
              <div className="value near-black f6 fw5">{data.expiryDate}</div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="stats-row flex flex-wrap justify-between items-start mb4">
            <div className="stat-group w-auto pr4 mb3">
              <div className="label silver f7 fw5 ttu tracked mb1">Conversion Rate</div>
              <div className="value near-black f6 fw5">{data.conversionRate}%</div>
            </div>
            <div className="stat-group w-auto pr4 mb3">
              <div className="label silver f7 fw5 ttu tracked mb1">Assignments Received</div>
              <div className="value near-black f6 fw5">{data.assignmentsReceived}</div>
            </div>
            <div className="stat-group w-auto pr4 mb3">
              <div className="label silver f7 fw5 ttu tracked mb1">Assignments Sent</div>
              <div className="value near-black f6 fw5">{data.assignmentsSent}</div>
            </div>
            <div className="stat-group w-auto pr4 mb3">
              <div className="label silver f7 fw5 ttu tracked mb1">New Applicants</div>
              <div className="value near-black f6 fw5">{data.newApplicants}</div>
            </div>
            <div className="stat-group w-auto mb3">
              <div className="label silver f7 fw5 ttu tracked mb1">Total Applications</div>
              <div className="value near-black f6 fw5">{data.totalApplications}</div>
            </div>
          </div>

          {/* Created By Row */}
          <div className="creator-row flex flex-wrap justify-between items-start mb4">
            <div className="creator-group w-50 pr4 mb3">
              <div className="label silver f7 fw5 ttu tracked mb1">Created By</div>
              <div className="value near-black f6 fw5">{data.createdBy}</div>
            </div>
            <div className="creator-group w-50 mb3">
              <div className="label silver f7 fw5 ttu tracked mb1">Automated By</div>
              <div className="value near-black f6 fw5">{data.automatedBy}</div>
            </div>
          </div>

          {/* Messages Section */}
          <div className="messages-section mb4">
            <div className="message-group mb3">
              <div className="label silver f7 fw5 ttu tracked mb2">Intro Message</div>
              <div className="message-text dark-gray f6">{data.introMessage}</div>
            </div>
            <div className="message-group mb3">
              <div className="label silver f7 fw5 ttu tracked mb2">Assignment Message</div>
              <div className="message-text dark-gray f6">{data.assignmentMessage}</div>
            </div>
            <div className="message-group mb3">
              <div className="label silver f7 fw5 ttu tracked mb2">Day-2 Followup</div>
              <div className="status-wrapper flex items-center justify-between mb2">
                <span className={`status-badge ${
                  data.day2Status === 'Completed' ? 'bg-green' : 'bg-gold'
                } br2 ph3 pv1 f7 white fw5`}>
                  {data.day2Status}
                </span>
                <button 
                  onClick={() => {
                    setFollowupType('day2');
                    setFollowupMessage(data.day2Followup);
                    setIsEditingFollowup(true);
                  }}
                  className="edit-btn bg-transparent blue bn underline pointer f7"
                >
                  Modify
                </button>
              </div>
              <div className="message-text dark-gray f6">{data.day2Followup}</div>
            </div>
            <div className="message-group">
              <div className="label silver f7 fw5 ttu tracked mb2">Day-4 Followup</div>
              <div className="status-wrapper flex items-center justify-between mb2">
                <span className={`status-badge ${
                  data.day4Status === 'Completed' ? 'bg-green' : 'bg-gold'
                } br2 ph3 pv1 f7 white fw5`}>
                  {data.day4Status}
                </span>
                <button 
                  onClick={() => {
                    setFollowupType('day4');
                    setFollowupMessage(data.day4Followup);
                    setIsEditingFollowup(true);
                  }}
                  className="edit-btn bg-transparent blue bn underline pointer f7"
                >
                  Modify
                </button>
              </div>
              <div className="message-text dark-gray f6">{data.day4Followup}</div>
            </div>
          </div>

          {/* Actions Row */}
          <div className="actions-row flex flex-wrap justify-between items-center">
            <div className="primary-actions flex mb3">
              <button 
                className="view-details-btn bg-blue white bn br2 ph3 pv2 mr3 pointer hover-bg-dark-blue"
                onClick={() => onViewDetails(data)}
              >
                View Details
              </button>
              <button className="edit-btn bg-light-gray near-black bn br2 ph3 pv2 pointer hover-bg-moon-gray">
                Edit
              </button>
              <button 
                className="announce-btn bg-purple white bn br2 ph3 pv2 ml3 pointer hover-bg-dark-purple"
                onClick={handleAnnounce}
                disabled={isAnnouncing}
              >
                {isAnnouncing ? 'Announcing...' : 'Announce'}
              </button>
            </div>
            <div className="secondary-actions flex items-center flex-wrap">
              <button 
                className="link-button blue mr3 bg-transparent bn pointer hover-underline"
                onClick={handleAssignmentLinks}
              >
                Assignment Links
              </button>
              <button 
                className="link-button blue mr3 bg-transparent bn pointer hover-underline"
                onClick={handleReviewLinks}
              >
                Review Links
              </button>
              <button 
                className="send-invite-btn bg-dark-gray white bn br2 ph3 pv2 mr3 pointer hover-bg-mid-gray"
                onClick={() => setShowInviteTemplate(!showInviteTemplate)}
              >
                Send Invite
              </button>
            </div>
          </div>

          {/* Invite Template Modal */}
          {showInviteTemplate && (
            <div className="invite-template mt4 pa4 bg-near-white br2">
              <textarea
                className="w-100 bg-white near-black ba b--moon-gray br2 pa3 mb3 f6"
                placeholder="Enter invite message..."
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                rows={4}
              />
              <button 
                className="send-btn bg-blue white bn br2 ph3 pv2 pointer hover-bg-dark-blue"
                onClick={handleSendInvite}
                disabled={!inviteMessage.trim()}
              >
                Send Invite
              </button>
            </div>
          )}
        </div>
      </div>

      {showDetailsModal && (
        <ListingDetailsModal 
          data={listingDetailsData[data.listingName]}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {/* Followup Edit Modal */}
      {isEditingFollowup && (
        <div className="fixed top-0 left-0 w-100 h-100 flex items-center justify-center bg-black-60 z-999">
          <div className="bg-white br3 pa4 w-50">
            <div className="flex justify-between items-center mb3">
              <h3 className="ma0">Modify Day-{followupType === 'day2' ? '2' : '4'} Followup</h3>
              <button 
                onClick={() => setIsEditingFollowup(false)}
                className="bg-transparent bn black-60 pointer hover-black"
              >
                ✕
              </button>
            </div>
            <textarea
              value={followupMessage}
              onChange={(e) => setFollowupMessage(e.target.value)}
              className="w-100 ba b--moon-gray br2 pa3 mb3"
              rows={6}
              placeholder="Enter followup message..."
            />
            <div className="flex justify-end">
              <button
                onClick={() => setIsEditingFollowup(false)}
                className="mr3 ba b--moon-gray bg-transparent ph3 pv2 br2 pointer hover-bg-near-white"
              >
                Cancel
              </button>
              <button
                onClick={() => handleModifyFollowup(followupType, followupMessage)}
                disabled={isUpdating || !followupMessage.trim()}
                className="bg-blue white bn br2 ph3 pv2 pointer hover-bg-dark-blue"
              >
                {isUpdating ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AutomatedListingCard; 