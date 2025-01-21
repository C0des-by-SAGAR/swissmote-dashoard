import React, { useState } from 'react';
import { questionService } from '../../../api/services/questionService';
import { toast } from 'react-toastify';

const QuestionsCard = ({ question, listingId }) => {
  const { author, date, content, id: message_id, chat_id } = question;
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleReplyClick = () => {
    setIsReplying(!isReplying);
    if (!isReplying) {
      setReplyContent('');
    }
  };

  const handleReplyChange = (e) => {
    setReplyContent(e.target.value);
  };

  const handleSendReply = async () => {
    if (!replyContent.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    try {
      setIsSending(true);
      await questionService.replyQuestion({
        listing: listingId,
        chat_id,
        message_id,
        message: replyContent.trim()
      });
      
      toast.success('Reply sent successfully');
      setReplyContent('');
      setIsReplying(false);
    } catch (error) {
      toast.error('Failed to send reply: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="question-card bg-white br3 pa4 mb3 shadow-1">
      <div className="flex justify-between items-start mb3">
        <div className="flex items-center">
          <div className="bg-light-blue br-100 pa3 mr3 flex items-center justify-center">
            <span className="f3 fw6 blue">{author.charAt(0)}</span>
          </div>
          <div>
            <h3 className="f4 fw6 dark-gray mv0">{author}</h3>
            <span className="f6 gray">{new Date(date).toLocaleString()}</span>
          </div>
        </div>
        <div className="flex items-center">
          <span className="f6 gray mr2">ID: {message_id}</span>
          <span className="f6 blue">text</span>
        </div>
      </div>
      
      <div className="bg-light-gray pa3 br2">
        <p className="f5 dark-gray mv0">{content}</p>
      </div>
      
      <div className="flex justify-end mt3">
        <button 
          className="action-btn blue"
          onClick={handleReplyClick}
          disabled={isSending}
        >
          <span className="mr2">↩</span> Reply
        </button>
      </div>
      
      {isReplying && (
        <div className="mt3">
          <textarea
            className="w-100 pa3 br2 ba b--light-gray mb2"
            placeholder="Type your reply here..."
            value={replyContent}
            onChange={handleReplyChange}
            rows="4"
            disabled={isSending}
          />
          <div className="flex justify-end mt2">
            <button 
              className="action-btn red mr3" 
              onClick={() => setIsReplying(false)}
              disabled={isSending}
            >
              Cancel
            </button>
            <button 
              className="action-btn blue" 
              onClick={handleSendReply}
              disabled={isSending || !replyContent.trim()}
            >
              {isSending ? 'Sending...' : 'Send Reply'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsCard; 