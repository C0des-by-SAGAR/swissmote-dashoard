import React, { useState } from 'react';
import { FiMessageSquare, FiMail, FiDownload, FiSend } from 'react-icons/fi';
import { FiCheck, FiClock, FiCalendar } from 'react-icons/fi';
import ReplyModal from './ReplyModal';
import MessageTemplate from '../../shared/MessageTemplate';
import { toast } from 'react-toastify';

const StatusIcon = ({ status }) => {
  const statusConfig = {
    evaluated: { icon: FiCheck, color: 'green' },
    pending: { icon: FiClock, color: 'orange' },
    future: { icon: FiCalendar, color: 'blue' }
  };

  const StatusComponent = statusConfig[status]?.icon;
  return StatusComponent ? (
    <StatusComponent className={`mr2 ${statusConfig[status].color}`} size={20} />
  ) : null;
};

const AssignmentCard = ({ assignment, onStatusChange }) => {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [showMessageTemplate, setShowMessageTemplate] = useState(false);
  const [message, setMessage] = useState('');

  const {
    candidateName,
    company,
    location,
    experience,
    receivedDate,
    relocation,
    status,
    attachments
  } = assignment;

  const handleReply = () => {
    // Telegram message sending logic would go here
    console.log(`Sending telegram message to ${candidateName}`);
  };

  const handleSendReply = (message) => {
    // Telegram message sending logic would go here
    console.log(`Sending telegram message to ${assignment.candidateName}:`, message);
  };

  const handleSendMessage = async () => {
    try {
      // Your send message logic here using the message state
      toast.success('Message sent successfully');
      setShowMessageTemplate(false);
    } catch (error) {
      toast.error('Error sending message');
    }
  };

  return (
    <>
      <div className="assignment-card bg-white br3 pa4 mb3 shadow-1 relative">
        <div className="flex flex-column">
          <div className="flex justify-between items-center">
            <h3 className="f3 fw6 dark-gray mv0">{candidateName}</h3>
            <StatusIcon status={status} />
          </div>
          
          <div className="flex items-center mt2">
            <FiMessageSquare className="gray mr2" />
            <span className="gray">{company}</span>
          </div>

          <div className="mt3 flex justify-between">
            <div>
              <div className="mb2">
                <span className="gray">Location: </span>
                <span className="dark-gray">{location}</span>
              </div>
              <div className="mb2">
                <span className="gray">Experience: </span>
                <span className="dark-gray">{experience}</span>
              </div>
            </div>
            <div>
              <div className="mb2">
                <span className="gray">Received: </span>
                <span className="dark-gray">{receivedDate}</span>
              </div>
              <div className="mb2">
                <span className="gray">Relocation: </span>
                <span className="dark-gray">{relocation}</span>
              </div>
            </div>
          </div>

          {attachments && attachments.length > 0 && (
            <div className="mt3">
              <h4 className="f6 gray mv2">Attachments:</h4>
              {attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment.url}
                  className="link blue hover-dark-blue db mb1 flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {attachment.name}
                  {attachment.isDownloadable && <FiDownload className="ml2" />}
                </a>
              ))}
            </div>
          )}

          <div className="action-buttons mt4 flex items-center">
            <button 
              className="action-btn mr3 flex items-center light-blue-btn"
              onClick={() => console.log('Chat clicked')}
            >
              <FiMessageSquare className="mr2 blue" />
              <span className="blue">Chat</span>
            </button>
            <button 
              className="action-btn mr3 flex items-center light-green-btn"
            >
              <span className="green">Evaluate</span>
            </button>
            <button 
              className="action-btn mr3 flex items-center light-purple-btn"
              onClick={() => setIsReplyModalOpen(true)}
            >
              <FiSend className="mr2 purple" />
              <span className="purple">Reply</span>
            </button>
            <button 
              className="action-btn flex items-center light-blue-btn"
            >
              <FiMail className="mr2 blue" />
              <span className="blue">Email</span>
            </button>
          </div>
        </div>
      </div>

      <ReplyModal
        isOpen={isReplyModalOpen}
        onClose={() => setIsReplyModalOpen(false)}
        candidateName={assignment.candidateName}
        onSendReply={handleSendReply}
      />

      <div className="assignment-actions">
        <button 
          className="action-button"
          onClick={() => setShowMessageTemplate(!showMessageTemplate)}
        >
          Send Message
        </button>
      </div>

      {showMessageTemplate && (
        <div className="message-section">
          <MessageTemplate 
            type="assignment_message"
            onMessageSelect={setMessage}
            allowEdit={true}
          />
          <button 
            className="send-button"
            onClick={handleSendMessage}
            disabled={!message.trim()}
          >
            Send Message
          </button>
        </div>
      )}
    </>
  );
};

export default AssignmentCard; 