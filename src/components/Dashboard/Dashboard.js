import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Tooltip 
} from 'recharts';
import { followUpData, conversionData, reviewData, summaryData } from './data/dashboardGraphData';
import DashboardHeader from './DashboardHeader';
import DashboardFooter from './DashboardFooter';
import './Dashboard.css';

const Dashboard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Listen for sidebar toggle event
  useEffect(() => {
    const handleSidebarToggle = (e) => {
      if (e.detail?.isExpanded !== undefined) {
        setIsSidebarExpanded(e.detail.isExpanded);
      }
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => window.removeEventListener('sidebarToggle', handleSidebarToggle);
  }, []);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="label">{`${label}: ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  const sharedChartConfig = {
    margin: { top: 20, right: 30, left: 20, bottom: 70 },
  };

  return (
    <div className={`dashboard-container ${isSidebarExpanded ? '' : 'sidebar-collapsed'}`}>
      <DashboardHeader title="Analytics Dashboard" />
      <div className="dashboard-charts-container">
        {/* Follow-up Status Chart */}
        <div className="chart-card">
          <h2 className="chart-title">Follow-up Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={followUpData} {...sharedChartConfig}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis domain={[0, 20]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill={(data) => data.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="chart-summary">
            <div className="summary-columns">
              <div className="summary-column">
                <h3>Day 2 Follow-ups</h3>
                <div className="status-list">
                  <div className="status-item">
                    <span className="dot sent-dot"></span>
                    <span className="status-label">Sent:</span>
                    <span className="status-value">{summaryData.followUp.day2.sent}</span>
                  </div>
                  <div className="status-item">
                    <span className="dot pending-dot"></span>
                    <span className="status-label">Pending:</span>
                    <span className="status-value">{summaryData.followUp.day2.pending}</span>
                  </div>
                </div>
              </div>
              <div className="summary-column">
                <h3>Day 4 Follow-ups</h3>
                <div className="status-list">
                  <div className="status-item">
                    <span className="dot sent-dot"></span>
                    <span className="status-label">Sent:</span>
                    <span className="status-value">{summaryData.followUp.day4.sent}</span>
                  </div>
                  <div className="status-item">
                    <span className="dot pending-dot"></span>
                    <span className="status-label">Pending:</span>
                    <span className="status-value">{summaryData.followUp.day4.pending}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Rate Chart */}
        <div className="chart-card">
          <h2 className="chart-title">Conversion Rate Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={conversionData} {...sharedChartConfig}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis domain={[0, 12]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill={(data) => data.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="distribution-summary">
            <h3>Distribution Summary</h3>
            <div className="distribution-list">
              <div className="distribution-item range-0-25">
                0-25%: {summaryData.distribution['0-25%']} listings
              </div>
              <div className="distribution-item range-26-50">
                26-50%: {summaryData.distribution['26-50%']} listings
              </div>
              <div className="distribution-item range-51-75">
                51-75%: {summaryData.distribution['51-75%']} listings
              </div>
              <div className="distribution-item range-76-100">
                76-100%: {summaryData.distribution['76-100%']} listings
              </div>
            </div>
          </div>
        </div>

        {/* Review Links Chart */}
        <div className="chart-card">
          <h2 className="chart-title">Review Links Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reviewData} {...sharedChartConfig}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                tick={{ fontSize: 12 }}
              />
              <YAxis domain={[0, 20]} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill={(data) => data.color} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <div className="review-summary">
            <h3>Review Links</h3>
            <div className="status-list">
              <div className="status-item">
                <span className="dot sent-dot"></span>
                <span className="status-label">Added:</span>
                <span className="status-value">{summaryData.reviews.added}</span>
              </div>
              <div className="status-item">
                <span className="dot pending-dot"></span>
                <span className="status-label">Pending:</span>
                <span className="status-value">{summaryData.reviews.pending}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DashboardFooter />
    </div>
  );
};

export default Dashboard;