import React from 'react';
import './DashboardFooter.css';

const DashboardFooter = () => {
  return (
    <div className="dashboard-footer">
      <div className="footer-content">
        <div className="ratio-container">
          <h2 className="ratio-title">Active vs Closed</h2>
          <div className="ratio-numbers">
            <span className="active-number">57</span>
            <span className="ratio-separator">/</span>
            <span className="total-number">89</span>
          </div>
          <p className="ratio-description">current active to closed ratio</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardFooter; 