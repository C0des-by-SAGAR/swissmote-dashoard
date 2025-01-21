import React from 'react';

const ListingDetailsModal = ({ data, dailyUpdates, isLoadingUpdates, onClose }) => {
  if (!data || !data.listingName) {
    return null;
  }

  return (
    <div className="modal-overlay fixed top-0 left-0 w-100 h-100 flex items-center justify-center bg-black-60 z-999">
      <div className="modal-content bg-dark-blue white-90 br3 w-70 mw8" style={{ maxHeight: '90vh' }}>
        {/* Header - Fixed */}
        <div className="modal-header flex items-center justify-between bg-blue pa3 bb b--black-10">
          <div className="flex items-center">
            <span className="f5 fw6">Listing Details</span>
            <span className="mh2 white-60">-</span>
            <span className="f5">{data.listingName}</span>
          </div>
          <button 
            onClick={onClose}
            className="bg-transparent bn white-90 pointer hover-white"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="pa4 overflow-auto" style={{ maxHeight: 'calc(90vh - 60px)' }}>
          {/* Basic Info */}
          <div className="flex flex-wrap mb4">
            <div className="w-50 pr4 mb3">
              <div className="mb3">
                <div className="white-60 f6 mb1">Listing Name</div>
                <div className="f5 white-90">{data.listingName || 'N/A'}</div>
              </div>
              <div className="mb3">
                <div className="white-60 f6 mb1">Date</div>
                <div className="f5 white-90">{data.date || 'N/A'}</div>
              </div>
            </div>
            <div className="w-50 mb3">
              <div className="mb3">
                <div className="white-60 f6 mb1">Project Name</div>
                <div className="f5 white-90">{data.projectName || 'N/A'}</div>
              </div>
              <div className="mb3">
                <div className="white-60 f6 mb1">Conversion Rate</div>
                <div className="f5 white-90">{data.conversionRate || '0'}%</div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="message-section mb4">
            {/* Intro Message */}
            <div className="bg-dark-gray pa3 mb3 br2">
              <div className="flex items-center mb2">
                <span className="light-blue mr2">⟲</span>
                <span className="f6 fw5 white-90">Intro Message</span>
              </div>
              <div className="message-scroll-container bg-dark-gray">
                <pre className="ma0 pa0 f6 lh-copy white-80 message-text">
                  {data.introMessage || 'No intro message available'}
                </pre>
              </div>
            </div>

            {/* Assignment Message */}
            <div className="bg-dark-gray pa3 br2">
              <div className="flex items-center mb2">
                <span className="light-blue mr2">⟲</span>
                <span className="f6 fw5 white-90">Assignment Message</span>
              </div>
              <div className="message-scroll-container bg-dark-gray">
                <pre className="ma0 pa0 f6 lh-copy white-80 message-text">
                  {data.assignmentMessage || 'No assignment message available'}
                </pre>
              </div>
            </div>
          </div>

          {/* Links */}
          <div className="mb4">
            <div className="mb3">
              <div className="white-60 f6 mb2">Assignment Links</div>
              <a href={data.assignmentLinks || '#'} className="light-blue no-underline hover-blue">{data.assignmentLinks || 'No assignment links available'}</a>
            </div>
            <div>
              <div className="white-60 f6 mb2">Review Links</div>
              <span className="white-80">{data.reviewLinks || 'No review links available'}</span>
            </div>
          </div>

          {/* Followups */}
          <div className="mb4">
            <div className="mb3">
              <div className="white-60 f6 mb2">Day 2 Followup</div>
              <p className="ma0 f6 lh-copy white-80 i">{data.day2Followup || 'No day 2 followup available'}</p>
            </div>
            <div>
              <div className="white-60 f6 mb2">Day 4 Followup</div>
              <p className="ma0 f6 lh-copy white-80 i">{data.day4Followup || 'No day 4 followup available'}</p>
            </div>
          </div>

          {/* Posting Details */}
          <div className="mb4">
            <div className="white-60 f6 mb2">Posting Details</div>
            <div className="f6 white-90">Posted Over: {data.postedOver || 'No posting details available'}</div>
          </div>

          {/* Metrics */}
          <div className="mb4">
            <div className="white-60 f6 mb2">Metrics Overview</div>
            <div className="flex flex-wrap">
              <div className="w-50 mb2">
                <span className="f6 white-90">Assignments Received: {data.assignmentsReceived || '0'}</span>
              </div>
              <div className="w-50 mb2">
                <span className="f6 white-90">Assignments Sent: {data.assignmentsSent || '0'}</span>
              </div>
              <div className="w-50 mb2">
                <span className="f6 white-90">New Applicants: {data.newApplicants || '0'}</span>
              </div>
              <div className="w-50 mb2">
                <span className="f6 white-90">Total Applications: {data.totalApplications || '0'}</span>
              </div>
            </div>
          </div>

          {/* Additional Details */}
          <div>
            <div className="white-60 f6 mb2">Additional Details</div>
            <div className="flex flex-wrap">
              <div className="w-50 mb2">
                <span className="f6 white-90">Expiry Date: {data.expiryDate || 'N/A'}</span>
              </div>
              <div className="w-50 mb2">
                <span className="f6 white-90">Created By: {data.createdBy || 'N/A'}</span>
              </div>
              <div className="w-50">
                <span className="f6 white-90">Automated By: {data.automatedBy || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Daily Updates Section */}
          <div className="mb4">
            <div className="white-60 f6 mb2">Daily Updates</div>
            {isLoadingUpdates ? (
              <div className="f6 white-70">Loading updates...</div>
            ) : dailyUpdates ? (
              <div className="bg-dark-gray pa3 br2">
                <pre className="ma0 pa0 f6 lh-copy white-80 message-text">
                  {JSON.stringify(dailyUpdates, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="f6 white-70">No updates available</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetailsModal;