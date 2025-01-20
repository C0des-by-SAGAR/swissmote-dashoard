import React, { useState, useEffect } from 'react';
import { announcementsService } from '../../api/services/announcements';
import { toast } from 'react-toastify';
import './Announcement.css';

const Announcement = ({ listingId, onAnnouncementSent }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [requestId, setRequestId] = useState(null);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    let statusInterval;
    if (requestId) {
      // Check status immediately
      checkAnnouncementStatus();
      // Then check every 5 seconds
      statusInterval = setInterval(checkAnnouncementStatus, 5000);
    }
    return () => {
      if (statusInterval) {
        clearInterval(statusInterval);
      }
    };
  }, [requestId]);

  const checkAnnouncementStatus = async () => {
    try {
      const response = await announcementsService.getAnnouncementStatus(requestId);
      setStatus(response);
      
      // If we get a final status, clear the interval and request ID
      if (response === 'completed' || response === 'failed') {
        setRequestId(null);
        if (response === 'completed') {
          toast.success('Announcement delivered successfully');
        } else {
          toast.error('Announcement delivery failed');
        }
      }
    } catch (error) {
      console.error('Error checking announcement status:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error('Please enter an announcement message');
      return;
    }

    try {
      setIsSending(true);
      const response = await announcementsService.makeAnnouncement({
        listingId,
        message: message.trim()
      });
      
      // Assuming the response includes a request_id
      if (response.request_id) {
        setRequestId(response.request_id);
        toast.info('Announcement sent, checking delivery status...');
      }
      
      setMessage('');
      if (onAnnouncementSent) {
        onAnnouncementSent();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error sending announcement');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="announcement-container pa3 bg-white br3 shadow-1">
      <h3 className="f4 fw6 mb3">Make Announcement</h3>
      <form onSubmit={handleSubmit}>
        <textarea
          className="announcement-textarea w-100 pa2 br2 mb3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your announcement message here..."
          rows={4}
          disabled={isSending}
        />
        <div className="flex justify-between items-center">
          {status && (
            <div className="status-message">
              Status: {status}
            </div>
          )}
          <button
            type="submit"
            className="announcement-button"
            disabled={isSending || !message.trim()}
          >
            {isSending ? 'Sending...' : 'Send Announcement'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Announcement; 