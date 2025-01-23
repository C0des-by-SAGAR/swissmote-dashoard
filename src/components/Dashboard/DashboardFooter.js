import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { statsService } from '../../api/services/statsService';
import './DashboardFooter.css';

const DashboardFooter = () => {
  const [stats, setStats] = useState({
    activeCount: 0,
    closedCount: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const listingsStats = await statsService.getListingsStats();
      setStats(listingsStats);
    } catch (error) {
      toast.error('Failed to fetch listings statistics');
      setStats({
        activeCount: 0,
        closedCount: 0
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="dashboard-footer">
      <div className="footer-content">
        <div className="ratio-container">
          <h2 className="ratio-title">Active vs Closed</h2>
          <div className="ratio-numbers">
            <span className="active-number">{stats.activeCount}</span>
            <span className="ratio-separator">/</span>
            <span className="total-number">{stats.activeCount + stats.closedCount}</span>
          </div>
          <p className="ratio-description">current active to closed ratio</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardFooter; 