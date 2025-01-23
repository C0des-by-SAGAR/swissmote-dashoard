import React, { useState } from 'react';
import './AutomateListingModal.css';
import { automateListingService } from '../../../../../../api/services/automateListingService';
import { toast } from 'react-toastify';

const AutomateListingModal = ({ isOpen, onClose, onSubmit, listing }) => {
  const [formData, setFormData] = useState({
    projectName: '',
    process: 'Assignment',
    designation: '',
    assignmentLink: '',
    postOver: 'Normal',
    ctc: '',
    introMessage: 'Default',
    customIntroMessage: '',
    assignmentMessage: 'Default',
    customAssignmentMessage: '',
    day2FollowUp: 'Default',
    customDay2Message: '',
    day4FollowUp: 'Default',
    customDay4Message: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const listingData = {
        listingNumber: listing.listingNumber,
        listingName: listing.listingName,
        name: formData.projectName,
        postOver: formData.postOver.toLowerCase(),
        assignmentLink: formData.assignmentLink,
        assignmentMessage: formData.assignmentMessage === 'Default' 
          ? defaultMessages.assignmentMessage.replace('xx_assignment_xx', formData.assignmentLink)
          : formData.customAssignmentMessage,
        inviteMessage: formData.introMessage === 'Default'
          ? defaultMessages.introMessage
          : formData.customIntroMessage,
        followup2: formData.day2FollowUp === 'Default'
          ? "\"Persistence is the twin sister of excellence. One is a matter of quality; the other, a matter of time.\" —Marabel Morgan"
          : formData.customDay2Message,
        followup4: formData.day4FollowUp === 'Default'
          ? "Success seems to be connected with action. Successful people keep moving. They make mistakes, but they dont quit. —Conrad Hilton"
          : formData.customDay4Message,
        designation: formData.designation || 'intern',
        empType: listing.employmentType?.toLowerCase().includes('intern') ? 'itn' : 'job',
        ctc: formData.ctc,
        account: listing.organisation === 'Persist Ventures' ? 'pv' : 'sa'
      };

      const loadingToast = toast.loading('Automating listing...');
      
      await automateListingService.automateListing(listingData);
      
      toast.update(loadingToast, {
        render: 'Listing automated successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });

      onSubmit(listingData);
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to automate listing');
    }
  };

  const defaultMessages = {
    introMessage: `Hello!!

First off, congrats if you are here! Your journey towards something extraordinary starts today. But before we dive into the exciting stuff, let's kick things off with a quick introduction to our dedicated team: https://www.youtube.com/watch?v=7KVOKfPKta8!

Why are we unique? Why do we call ourselves Persist Ventures or Systemic Altruism? Because we've crafted a unique system that sets us apart from the rest.

Our ultimate hiring criterion? Your skills! That's the only test you need to pass. Show us what you can do, and you're in! Here is a sneak peek into our world, where our founder interacts with some of our team leaders hired from internshala: https://www.loom.com/share/4dfd4137c8be47febd9c89d6b71f9dcc?sid=f8062b55-1c9e-4f64-941f-bc306780d170

The assignment details will be shared soon. If you are looking to secure a amazing placement with good base salary, and wants to lead your own organization in the future, and stabilize rest of your career, then you are at right place!
Read this completely: https://persistventure.notion.site/Persist-Ventures-x-Systemic-Altruism-Captains-Program-6715273ec3d347fd8bf230563ba0b539?pvs=4

We are exited to onboard leaders who believe in them, in their skillset and knowledge over just resumes and degrees.
https://youtu.be/itGNk0wellQ?si=0-bGHBwCU5QV90Yp

Persist Ventures: https://persistventures.com/
Systemic Altruism: https://systemicaltruism.com/
Instagram: https://instagram.com/persistventures
LinkedIn: https://www.linkedin.com/company/persist-ventures

Remember, If you had one shot, or one opportunity, to seize everything you ever wanted in one moment, would you capture it or just let it slip? You will find your answer when you submit your assignment.

Thanks,
Jack Jay
Founder, Systemic Altruism & Persist Ventures

https://twitter.com/jackjayio
https://instagram.com/web3wizard
https://www.linkedin.com/in/jack-jay-jackson-jesionowski/`,
    assignmentMessage: `Thank you for your interest in our job opening. As a next step, we are expecting you to complete a short assignment.
Watch this video this is your assignment:
xx_assignment_xx

Read all this details carefully and give your best, watch the video for any further queries and updates:
xx_bot_xx`
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header flex items-center justify-between pb3 bb b--light-gray">
          <h2 className="mv0">Automate Listing</h2>
          <button 
            onClick={onClose}
            className="close-button bg-transparent bn pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="section-title">Basic Information</div>
          
          <div className="form-grid">
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                name="projectName"
                value={formData.projectName}
                onChange={handleInputChange}
                placeholder="Enter project name"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label>Process</label>
              <select
                name="process"
                value={formData.process}
                onChange={handleInputChange}
                className="select-field"
              >
                <option value="Assignment">Assignment</option>
                <option value="Offer">Offer</option>
              </select>
            </div>
          </div>

          {/* Conditional Designation field */}
          {formData.process === 'Offer' && (
            <div className="form-group full-width">
              <label>Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                placeholder="Enter designation"
                className="input-field"
              />
            </div>
          )}

          <div className="section-title">Assignment Details</div>
          
          <div className="form-group full-width">
            <label>Assignment Link</label>
            <input
              type="text"
              name="assignmentLink"
              value={formData.assignmentLink}
              onChange={handleInputChange}
              placeholder="Enter assignment link"
              className="input-field"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Post Over</label>
              <select
                name="postOver"
                value={formData.postOver}
                onChange={handleInputChange}
                className="select-field"
              >
                <option value="Normal">Normal</option>
                <option value="Startupathon">Startupathon</option>
              </select>
            </div>

            <div className="form-group">
              <label>CTC</label>
              <input
                type="text"
                name="ctc"
                value={formData.ctc}
                onChange={handleInputChange}
                placeholder="Enter CTC"
                className="input-field"
              />
            </div>
          </div>

          <div className="section-title">Messages</div>

          {/* Message selection fields */}
          {[
            { label: 'Intro Message', name: 'introMessage', customName: 'customIntroMessage' },
            { label: 'Assignment Message', name: 'assignmentMessage', customName: 'customAssignmentMessage' },
            { label: 'Day 2 Follow-up', name: 'day2FollowUp', customName: 'customDay2Message' },
            { label: 'Day 4 Follow-up', name: 'day4FollowUp', customName: 'customDay4Message' }
          ].map(({ label, name, customName }) => (
            <div key={name} className="form-group full-width">
              <label>{label}</label>
              <select
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className="select-field"
              >
                <option value="Default">Default</option>
                <option value="Custom">Custom Message</option>
              </select>
              {formData[name] === 'Custom' && (
                <textarea
                  name={customName}
                  value={formData[customName]}
                  onChange={handleInputChange}
                  placeholder="Enter your custom message"
                  className="textarea-field mt2"
                  rows="4"
                />
              )}
            </div>
          ))}

          {/* Intro Message */}
          <div className="form-group full-width">
            <label>Intro Message</label>
            <select
              name="introMessage"
              value={formData.introMessage}
              onChange={handleInputChange}
              className="select-field"
            >
              <option value="Default">Default</option>
              <option value="Custom">Custom Message</option>
            </select>
            {formData.introMessage === 'Default' ? (
              <div className="default-message-preview">
                <pre className="message-preview">{defaultMessages.introMessage}</pre>
              </div>
            ) : (
              <textarea
                name="customIntroMessage"
                value={formData.customIntroMessage}
                onChange={handleInputChange}
                placeholder="Enter your custom message"
                className="textarea-field mt2"
                rows="4"
              />
            )}
          </div>

          {/* Assignment Message */}
          <div className="form-group full-width">
            <label>Assignment Message</label>
            <select
              name="assignmentMessage"
              value={formData.assignmentMessage}
              onChange={handleInputChange}
              className="select-field"
            >
              <option value="Default">Default</option>
              <option value="Custom">Custom Message</option>
            </select>
            {formData.assignmentMessage === 'Default' ? (
              <div className="default-message-preview">
                <pre className="message-preview">{defaultMessages.assignmentMessage}</pre>
              </div>
            ) : (
              <textarea
                name="customAssignmentMessage"
                value={formData.customAssignmentMessage}
                onChange={handleInputChange}
                placeholder="Enter your custom message"
                className="textarea-field mt2"
                rows="4"
              />
            )}
          </div>

          {/* Day 2 and Day 4 Follow-up */}
          {['day2FollowUp', 'day4FollowUp'].map((name) => (
            <div key={name} className="form-group full-width">
              <label>{name === 'day2FollowUp' ? 'Day 2 Follow-up' : 'Day 4 Follow-up'}</label>
              <select
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className="select-field"
              >
                <option value="Default">Default</option>
                <option value="Custom">Custom Message</option>
              </select>
              {formData[name] === 'Custom' && (
                <textarea
                  name={`custom${name.charAt(0).toUpperCase() + name.slice(1)}Message`}
                  value={formData[`custom${name.charAt(0).toUpperCase() + name.slice(1)}Message`]}
                  onChange={handleInputChange}
                  placeholder="Enter your custom message"
                  className="textarea-field mt2"
                  rows="4"
                />
              )}
            </div>
          ))}

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="submit-button">
              Automate Listing
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AutomateListingModal; 