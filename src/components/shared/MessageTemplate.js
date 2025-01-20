import React, { useState, useEffect } from 'react';
import { messagesService } from '../../api/services/messages';
import { toast } from 'react-toastify';
import './MessageTemplate.css';

const MESSAGE_TYPES = {
  INVITE: 'invite_message',
  ASSIGNMENT: 'assignment_message',
  HIRED: 'hired_message',
  STARTUPATHON: 'assignment_message_startupathon'
};

const MessageTemplate = ({ type, onMessageSelect, disabled = false, allowEdit = false }) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState('');

  useEffect(() => {
    if (type) {
      fetchMessage();
    }
  }, [type]);

  const fetchMessage = async () => {
    try {
      setIsLoading(true);
      const response = await messagesService.getMessage(type);
      setMessage(response);
      setEditedMessage(response);
      if (onMessageSelect) {
        onMessageSelect(response);
      }
    } catch (error) {
      toast.error('Error loading message template');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    try {
      setIsSaving(true);
      await messagesService.setMessage(type, editedMessage);
      setMessage(editedMessage);
      setIsEditing(false);
      toast.success('Template saved successfully');
      if (onMessageSelect) {
        onMessageSelect(editedMessage);
      }
    } catch (error) {
      toast.error('Error saving template');
      console.error('Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedMessage(message);
    setIsEditing(false);
  };

  return (
    <div className="message-template">
      {isLoading ? (
        <div className="loading-spinner">Loading template...</div>
      ) : (
        <>
          <div className="template-header">
            {allowEdit && !isEditing && (
              <button 
                className="edit-button"
                onClick={() => setIsEditing(true)}
                disabled={disabled}
              >
                Edit Template
              </button>
            )}
          </div>

          <textarea
            className="message-textarea"
            value={isEditing ? editedMessage : message}
            onChange={(e) => {
              const newMessage = e.target.value;
              if (isEditing) {
                setEditedMessage(newMessage);
              } else {
                setMessage(newMessage);
                if (onMessageSelect) {
                  onMessageSelect(newMessage);
                }
              }
            }}
            disabled={disabled || (!isEditing && allowEdit)}
            rows={6}
            placeholder="Message template will load here..."
          />

          {isEditing && (
            <div className="template-actions">
              <button 
                className="save-button"
                onClick={handleSaveTemplate}
                disabled={isSaving || !editedMessage.trim()}
              >
                {isSaving ? 'Saving...' : 'Save Template'}
              </button>
              <button 
                className="cancel-button"
                onClick={handleCancelEdit}
                disabled={isSaving}
              >
                Cancel
              </button>
            </div>
          )}

          {!isEditing && (
            <button 
              className="refresh-template"
              onClick={fetchMessage}
              disabled={disabled || isLoading}
            >
              Reset to Default
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default MessageTemplate; 