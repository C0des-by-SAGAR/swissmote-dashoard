import React, { useState } from 'react';
import { FiX } from 'react-icons/fi';

const ReplyModal = ({ isOpen, onClose, candidateName, onSendReply }) => {
  const [reply, setReply] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSendReply(reply);
    setReply('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="reply-modal">
        <div className="modal-header flex justify-between items-center bb b--light-gray pb3">
          <h2 className="f4 fw6 dark-gray mv0">Reply to {candidateName}</h2>
          <button 
            className="close-button bn bg-transparent"
            onClick={onClose}
          >
            <FiX size={24} className="gray hover-dark-gray" />
          </button>
        </div>

        <div className="modal-body pv4">
          <textarea
            className="reply-textarea"
            placeholder="Type your message here..."
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            rows={6}
            autoFocus
          />
        </div>

        <div className="modal-footer flex justify-end pt3 bt b--light-gray">
          <button 
            className="cancel-btn mr3"
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="send-btn"
            onClick={handleSubmit}
            disabled={!reply.trim()}
          >
            Send Reply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyModal; 