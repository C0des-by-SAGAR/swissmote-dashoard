import React from 'react';
import './DashboardFooter.css';

const DashboardFooter = ({ stats }) => {
  const activeListings = stats?.automatedListings + (stats?.notAutomatedListings || 0);
  const totalListings = activeListings + (stats?.expiredListings || 0);

  return (
    <div className="dashboard-footer">
      <div className="footer-content">
        <div className="ratio-container">
          <h2 className="ratio-title">Active vs Closed</h2>
          <div className="ratio-numbers">
            <span className="active-number">{activeListings || 0}</span>
            <span className="ratio-separator">/</span>
            <span className="total-number">{totalListings || 0}</span>
          </div>
          <p className="ratio-description">current active to closed ratio</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardFooter; 