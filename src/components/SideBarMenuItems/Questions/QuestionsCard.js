import React, { useState } from 'react';

const QuestionsCard = ({ question }) => {
  const { author, date, content, id } = question;
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  const handleReplyClick = () => {
    setIsReplying(!isReplying);
  };

  const handleReplyChange = (e) => {
    setReplyContent(e.target.value);
  };

  const handleSendReply = () => {
    console.log('Reply sent:', replyContent);
    setReplyContent('');
    setIsReplying(false);
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
          <span className="f6 gray mr2">ID: {id}</span>
          <span className="f6 blue">text</span>
        </div>
      </div>
      <div className="bg-light-gray pa3 br2">
        <p className="f5 dark-gray mv0">{content}</p>
      </div>
      <div className="flex justify-end mt3">
        <button className="action-btn blue" onClick={handleReplyClick}>
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
          />
          <div className="flex justify-end mt2">
            <button className="action-btn red mr3" onClick={() => setIsReplying(false)}>
              Cancel
            </button>
            <button className="action-btn blue" onClick={handleSendReply}>
              Send Reply
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsCard; 