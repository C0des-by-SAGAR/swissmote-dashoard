import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Tooltip 
} from 'recharts';
import { followUpData, conversionData, reviewData, summaryData } from './data/dashboardGraphData';
import DashboardHeader from './DashboardHeader';
import DashboardFooter from './DashboardFooter';
import './Dashboard.css';

const Dashboard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [chartType, setChartType] = useState('Bar');

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
      const { name, value } = payload[0];
      return (
        <div className="custom-tooltip">
          <p className="label">{`${name}: ${value}`}</p>
        </div>
      );
    }
    return null;
  };

  const sharedChartConfig = {
    margin: { top: 20, right: 30, left: 20, bottom: 70 },
  };

  const handleChartTypeChange = (e) => {
    setChartType(e.target.value);
  };

  const renderChart = (data) => {
    switch (chartType) {
      case 'Line':
        return (
          <LineChart data={data} {...sharedChartConfig}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval={0} tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        );
      case 'Pie':
        return (
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#82ca9d">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );
      default:
        return (
          <BarChart data={data} {...sharedChartConfig}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval={0} tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" fill={(data) => data.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
    }
  };

  return (
    <div className={`dashboard-container ${isSidebarExpanded ? '' : 'sidebar-collapsed'}`}>
      <DashboardHeader title="Analytics Dashboard" />
      <div className="chart-type-selector">
        <label htmlFor="chartType">Select Chart Type: </label>
        <select id="chartType" value={chartType} onChange={handleChartTypeChange}>
          <option value="Bar">Bar Chart</option>
          <option value="Line">Line Chart</option>
          <option value="Pie">Pie Chart</option>
        </select>
      </div>
      <div className="dashboard-charts-container">
        {/* Follow-up Status Chart */}
        <div className="chart-card">
          <h2 className="chart-title">Follow-up Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            {renderChart(followUpData)}
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
            {renderChart(conversionData)}
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
            {renderChart(reviewData)}
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