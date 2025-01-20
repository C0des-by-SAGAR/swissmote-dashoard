import React, { useState } from 'react';
import { toast } from 'react-toastify';
import MessageTemplate from '../../../shared/MessageTemplate';

const AutomatedListingCard = ({ data }) => {
  const [showInviteTemplate, setShowInviteTemplate] = useState(false);
  const [inviteMessage, setInviteMessage] = useState('');

  const handleSendInvite = async () => {
    try {
      // Your send invite logic here using the inviteMessage state
      toast.success('Invite sent successfully');
      setShowInviteTemplate(false);
    } catch (error) {
      toast.error('Error sending invite');
    }
  };

  return (
    <div className="listing-card">
      <div className="listing-header">
        <span className="listing-hash">#</span>
      </div>

      <div className="listing-details">
        <div className="detail-row">
          <div className="detail-group">
            <div className="label">LISTING NAME</div>
            <div className="value">{data.listingName}</div>
          </div>
          <div className="detail-group">
            <div className="label">PROJECT NAME</div>
            <div className="value">{data.projectName}</div>
          </div>
          <div className="detail-group">
            <div className="label">DATE</div>
            <div className="value">{data.date}</div>
          </div>
          <div className="detail-group">
            <div className="label">POSTED OVER</div>
            <div className="value">{data.postedOver}</div>
          </div>
          <div className="detail-group">
            <div className="label">EXPIRY DATE</div>
            <div className="value">{data.expiryDate}</div>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-group">
            <div className="label">CONVERSION RATE</div>
            <div className="value conversion-rate">{data.conversionRate}%</div>
          </div>
          <div className="detail-group">
            <div className="label">ASSIGNMENTS RECEIVED</div>
            <div className="value">{data.assignmentsReceived}</div>
          </div>
          <div className="detail-group">
            <div className="label">ASSIGNMENTS SENT</div>
            <div className="value">{data.assignmentsSent}</div>
          </div>
          <div className="detail-group">
            <div className="label">NEW APPLICANTS</div>
            <div className="value">{data.newApplicants}</div>
          </div>
          <div className="detail-group">
            <div className="label">TOTAL APPLICATIONS</div>
            <div className="value">{data.totalApplications}</div>
          </div>
        </div>

        <div className="detail-row">
          <div className="detail-group">
            <div className="label">CREATED BY</div>
            <div className="value">{data.createdBy}</div>
          </div>
          <div className="detail-group">
            <div className="label">AUTOMATED BY</div>
            <div className="value">{data.automatedBy}</div>
          </div>
        </div>

        <div className="messages-section">
          <div className="message-group">
            <div className="label">INTRO MESSAGE</div>
            <div className="message-text">{data.introMessage}</div>
          </div>
          <div className="message-group">
            <div className="label">ASSIGNMENT MESSAGE</div>
            <div className="message-text">{data.assignmentMessage}</div>
          </div>
          <div className="message-group">
            <div className="label">Day-2 Followup</div>
            <div className="message-header">
              <span className={`status-badge ${data.day2Status === 'Completed' ? 'completed' : 'pending'}`}>
                {data.day2Status}
              </span>
            </div>
            <div className="message-text">{data.day2Followup}</div>
          </div>
          <div className="message-group">
            <div className="label">Day-4 Followup</div>
            <div className="message-header">
              <span className={`status-badge ${data.day4Status === 'Completed' ? 'completed' : 'pending'}`}>
                {data.day4Status}
              </span>
            </div>
            <div className="message-text">{data.day4Followup}</div>
          </div>
        </div>

        <div className="card-actions">
          <div className="primary-actions">
            <button className="view-details">View Details</button>
            <button className="edit">Edit</button>
          </div>
          <div className="secondary-actions">
            <a href="#" className="link">Assignment Links</a>
            <a href="#" className="link">Review Links</a>
          </div>
          <button 
            className="action-button"
            onClick={() => setShowInviteTemplate(!showInviteTemplate)}
          >
            Send Invite
          </button>
        </div>
      </div>

      {showInviteTemplate && (
        <div className="message-section">
          <MessageTemplate 
            type="invite_message"
            onMessageSelect={setInviteMessage}
          />
          <button 
            className="send-button"
            onClick={handleSendInvite}
            disabled={!inviteMessage.trim()}
          >
            Send Invite
          </button>
        </div>
      )}
    </div>
  );
};

export default AutomatedListingCard; 