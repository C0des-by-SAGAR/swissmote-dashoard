import React from 'react';
import { FiMessageSquare, FiMail } from 'react-icons/fi';
import { replyService } from '../../../api/services/replyService';
import { replyCandidateBotService } from '../../../api/services/replyCandidateBotService';
import { toast } from 'react-hot-toast';
import { candidateEmailService } from '../../../api/services/candidateEmailService';
import { evaluatedAssignmentService } from '../../../api/services/evaluatedAssignmentService';
import { reviewService } from '../../../api/services/reviewService';
import './AssignmentCard.css';

const AssignmentCard = ({ data }) => {
  const handleReply = async (candidateId, message) => {
    try {
      await replyService.replyToCandidate(data.listing_num, {
        candidate_id: candidateId,
        message: message
      });
      toast.success('Reply sent successfully');
    } catch (error) {
      toast.error('Failed to send reply');
      console.error('Error:', error);
    }
  };

  const handleBotReply = async (chatId, messageId) => {
    try {
      await replyCandidateBotService.replyWithBot(data.listing_num, {
        chat_id: chatId,
        message_id: messageId,
        message: "Bot reply message"
      });
      toast.success('Bot reply sent successfully');
    } catch (error) {
      toast.error('Failed to send bot reply');
      console.error('Error:', error);
    }
  };

  const handleGetEmail = async () => {
    try {
      await candidateEmailService.getCandidateEmail({
        applicant_id: data.id,
        org: data.organization
      });
      toast.success('Email fetched successfully');
    } catch (error) {
      toast.error('Failed to fetch email');
      console.error('Error:', error);
    }
  };

  const handleGetEvaluation = async () => {
    try {
      await evaluatedAssignmentService.getEvaluatedAssignment({
        applicant_id: data.id,
        org: data.organization
      });
      toast.success('Evaluation fetched successfully');
    } catch (error) {
      toast.error('Failed to fetch evaluation');
      console.error('Error:', error);
    }
  };

  const handleAddReview = async () => {
    try {
      await reviewService.addReview({
        listing: data.listing_num,
        link: data.attachments?.[0]?.url || ''  // Using the first attachment URL if available
      });
      toast.success('Review added successfully');
    } catch (error) {
      toast.error('Failed to add review');
      console.error('Error:', error);
    }
  };

  return (
    <div className="assignment-card bg-white br3 pa3 ma2 shadow-1">
      <h2 className="f3 mb2">{data.name}</h2>
      
      <div className="source-info flex items-center mb3">
        <FiMessageSquare className="mr2 gray" />
        <span className="gray">{data.source}</span>
      </div>

      <div className="details flex justify-between mb3">
        <div>
          <p className="mv2">
            <span className="gray">Location: </span>
            {data.location}
          </p>
          <p className="mv2">
            <span className="gray">Experience: </span>
            {data.experience}
          </p>
        </div>
        <div>
          <p className="mv2">
            <span className="gray">Received: </span>
            {data.receivedDate}
          </p>
          <p className="mv2">
            <span className="gray">Relocation: </span>
            {data.relocation ? 'Yes' : 'No'}
          </p>
        </div>
      </div>

      {data.attachments && (
        <div className="attachments mb3">
          <h3 className="f5 gray mb2">Attachments:</h3>
          <a href={data.attachments} className="blue no-underline hover-underline" target="_blank" rel="noopener noreferrer">
            {data.attachments}
          </a>
        </div>
      )}

      <div className="actions flex flex-wrap">
        <button className="action-btn bg-light-blue bn br2 pa2 pointer mr2 mb2">
          <FiMessageSquare className="mr2" />
          Chat
        </button>
        {data.isEvaluated ? (
          <button 
            className="action-btn bg-moon-gray bn br2 pa2 pointer mr2 mb2"
            disabled
          >
            Evaluated
          </button>
        ) : (
          <button 
            className="action-btn bg-light-green bn br2 pa2 pointer mr2 mb2"
            onClick={handleGetEvaluation}
          >
            Evaluate
          </button>
        )}
        <button 
          className="action-btn bg-blue white bn br2 pa2 pointer mr2 mb2"
          onClick={() => handleReply(data.id, "Default reply message")}
        >
          <FiMail className="mr2" />
          Reply
        </button>
        <button 
          className="action-btn bg-green white bn br2 pa2 pointer mb2"
          onClick={handleGetEmail}
        >
          Email
        </button>
        <button 
          className="action-btn bg-purple white bn br2 pa2 pointer mb2"
          onClick={handleAddReview}
        >
          Add Review
        </button>
      </div>
    </div>
  );
};

export default AssignmentCard; 