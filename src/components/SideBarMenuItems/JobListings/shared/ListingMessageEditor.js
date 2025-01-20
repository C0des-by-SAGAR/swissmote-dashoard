import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { listingsService } from '../../../../api/services/listings';
import MessageTemplate from '../../../shared/MessageTemplate';
import './ListingMessageEditor.css';

const ListingMessageEditor = ({ listingId, onMessageUpdate }) => {
  const [assignmentMessage, setAssignmentMessage] = useState('');
  const [introMessage, setIntroMessage] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateMessages = async () => {
    if (!assignmentMessage.trim() && !introMessage.trim()) {
      toast.error('Please provide at least one message to update');
      return;
    }

    try {
      setIsUpdating(true);
      await listingsService.updateListingMessage({
        listingId,
        assignmentMessage: assignmentMessage.trim(),
        introMessage: introMessage.trim()
      });

      toast.success('Messages updated successfully');
      if (onMessageUpdate) {
        onMessageUpdate();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error updating messages');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="listing-message-editor">
      <div className="message-section">
        <h4 className="message-title">Assignment Message</h4>
        <MessageTemplate
          type="assignment_message"
          onMessageSelect={setAssignmentMessage}
          disabled={isUpdating}
          allowEdit={true}
        />
      </div>

      <div className="message-section">
        <h4 className="message-title">Introduction Message</h4>
        <MessageTemplate
          type="invite_message"
          onMessageSelect={setIntroMessage}
          disabled={isUpdating}
          allowEdit={true}
        />
      </div>

      <div className="editor-actions">
        <button
          className="update-button"
          onClick={handleUpdateMessages}
          disabled={isUpdating || (!assignmentMessage.trim() && !introMessage.trim())}
        >
          {isUpdating ? 'Updating...' : 'Update Messages'}
        </button>
      </div>
    </div>
  );
};

export default ListingMessageEditor; 