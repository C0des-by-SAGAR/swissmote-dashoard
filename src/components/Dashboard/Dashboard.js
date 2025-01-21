import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, ResponsiveContainer,
  Tooltip 
} from 'recharts';
import { dashboardService } from '../../api/services/dashboardService';
import { reviewService } from '../../api/services/reviewService';
import DashboardHeader from './DashboardHeader';
import DashboardFooter from './DashboardFooter';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [chartType, setChartType] = useState('Line');
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewStats, setReviewStats] = useState({
    added: 0,
    pending: 0
  });

  // Improve data validation helper
  const isValidChartData = (data) => {
    if (!data) return false;
    return Array.isArray(data) && data.length > 0 && data.every(item => 
      item && 
      typeof item === 'object' && 
      'name' in item && 
      'value' in item &&
      item.value !== null &&
      item.value !== undefined
    );
  };

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await dashboardService.getDashboardData();
        const validatedData = validateDashboardData(response);
        setDashboardData(validatedData);
      } catch (error) {
        toast.error('Error fetching dashboard data');
        console.error('Dashboard Error:', error);
        setDashboardData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  useEffect(() => {
    // Update the review stats when assignments change
    if (dashboardData?.reviewData.length > 0) {
      const reviewedCount = dashboardData.reviewData.filter(a => a.hasReview).length;
      setReviewStats({
        added: reviewedCount,
        pending: dashboardData.reviewData.length - reviewedCount
      });
    }
  }, [dashboardData]);

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

  // Define vibrant neon colors for charts
  const neonColors = {
    blue: '#00ffff',    // Cyan
    purple: '#ff00ff',  // Magenta
    green: '#39ff14',   // Neon green
    yellow: '#ffff00',  // Yellow
    orange: '#ff9100',  // Neon orange
    pink: '#ff69b4'     // Hot pink
  };

  const renderChart = (data) => {
    if (!isValidChartData(data)) {
      return (
        <div className="chart-error">
          <p>Invalid or missing chart data</p>
        </div>
      );
    }

    switch (chartType) {
      case 'Line':
        return (
          <LineChart data={data} {...sharedChartConfig}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ff00ff" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={60} 
              interval={0} 
              tick={{ fontSize: 12, fill: '#e2e8f0' }} 
            />
            <YAxis tick={{ fill: '#e2e8f0' }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="value" stroke={neonColors.blue} />
          </LineChart>
        );
      case 'Pie':
        return (
          <PieChart>
            <Pie 
              data={data} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={100}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={Object.values(neonColors)[index % Object.values(neonColors).length]} 
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );
      default:
        return (
          <BarChart data={data} {...sharedChartConfig}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={60} 
              interval={0} 
              tick={{ fontSize: 12, fill: '#e2e8f0' }} 
            />
            <YAxis tick={{ fill: '#e2e8f0' }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar 
              dataKey="value" 
              radius={[4, 4, 0, 0]}
              fill={(entry) => {
                // Map different statuses to vibrant neon colors
                switch (entry.name) {
                  case 'Day 2 Sent':
                  case 'Reviews Added':
                    return neonColors.green;
                  case 'Day 2 Pending':
                  case 'Reviews Pending':
                    return neonColors.orange;
                  case 'Day 4 Sent':
                    return neonColors.blue;
                  case 'Day 4 Pending':
                    return neonColors.yellow;
                  default:
                    // For conversion rate distribution
                    if (entry.name.includes('0-25')) return neonColors.pink;
                    if (entry.name.includes('26-50')) return neonColors.orange;
                    if (entry.name.includes('51-75')) return neonColors.blue;
                    if (entry.name.includes('76-100')) return neonColors.green;
                    return neonColors.purple;
                }
              }}
            />
          </BarChart>
        );
    }
  };

  // Improve SafeChartRenderer with better error handling
  const SafeChartRenderer = ({ data, title }) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return (
        <div className="chart-error">
          <p>No data available for {title}</p>
        </div>
      );
    }

    try {
      return (
        <ResponsiveContainer width="100%" height={300}>
          {renderChart(data)}
        </ResponsiveContainer>
      );
    } catch (error) {
      console.error(`Error rendering ${title} chart:`, error);
      return (
        <div className="chart-error">
          <p>Error loading {title} chart</p>
        </div>
      );
    }
  };

  // Improve dashboard data validation
  const validateDashboardData = (data) => {
    if (!data) return {
      stats: {},
      followUpData: [],
      conversionData: [],
      reviewData: [],
      summaryData: {
        followUp: {
          day2: { sent: 0, pending: 0 },
          day4: { sent: 0, pending: 0 }
        },
        distribution: {},
        reviews: { added: 0, pending: 0 }
      }
    };
    
    return {
      stats: data.stats || {},
      followUpData: Array.isArray(data.followUpData) ? data.followUpData.filter(item => item && item.name && item.value !== undefined) : [],
      conversionData: Array.isArray(data.conversionData) ? data.conversionData.filter(item => item && item.name && item.value !== undefined) : [],
      reviewData: Array.isArray(data.reviewData) ? data.reviewData.filter(item => item && item.name && item.value !== undefined) : [],
      summaryData: {
        followUp: {
          day2: {
            sent: Number(data.summaryData?.followUp?.day2?.sent) || 0,
            pending: Number(data.summaryData?.followUp?.day2?.pending) || 0
          },
          day4: {
            sent: Number(data.summaryData?.followUp?.day4?.sent) || 0,
            pending: Number(data.summaryData?.followUp?.day4?.pending) || 0
          }
        },
        distribution: data.summaryData?.distribution || {},
        reviews: {
          added: Number(data.summaryData?.reviews?.added) || 0,
          pending: Number(data.summaryData?.reviews?.pending) || 0
        }
      }
    };
  };

  if (isLoading) {
    return (
      <div className="dashboard-loading">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className={`dashboard-container ${isSidebarExpanded ? '' : 'sidebar-collapsed'}`}>
      <DashboardHeader title="Analytics Dashboard" stats={dashboardData?.stats} />
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
          <SafeChartRenderer 
            data={dashboardData?.followUpData} 
            title="Follow-up Status"
          />
          <div className="chart-summary">
            <div className="summary-columns">
              <div className="summary-column">
                <h3>Day 2 Follow-ups</h3>
                <div className="status-list">
                  <div className="status-item">
                    <span className="dot" style={{ backgroundColor: neonColors.green }}></span>
                    <span className="status-label">Sent:</span>
                    <span className="status-value">{dashboardData?.summaryData.followUp.day2.sent || 0}</span>
                  </div>
                  <div className="status-item">
                    <span className="dot" style={{ backgroundColor: neonColors.orange }}></span>
                    <span className="status-label">Pending:</span>
                    <span className="status-value">{dashboardData?.summaryData.followUp.day2.pending || 0}</span>
                  </div>
                </div>
              </div>
              <div className="summary-column">
                <h3>Day 4 Follow-ups</h3>
                <div className="status-list">
                  <div className="status-item">
                    <span className="dot" style={{ backgroundColor: neonColors.blue }}></span>
                    <span className="status-label">Sent:</span>
                    <span className="status-value">{dashboardData?.summaryData.followUp.day4.sent || 0}</span>
                  </div>
                  <div className="status-item">
                    <span className="dot" style={{ backgroundColor: neonColors.yellow }}></span>
                    <span className="status-label">Pending:</span>
                    <span className="status-value">{dashboardData?.summaryData.followUp.day4.pending || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Rate Chart */}
        <div className="chart-card">
          <h2 className="chart-title">Conversion Rate Distribution</h2>
          <SafeChartRenderer 
            data={dashboardData?.conversionData} 
            title="Conversion Rate"
          />
          <div className="distribution-summary">
            <h3>Distribution Summary</h3>
            <div className="distribution-list">
              {Object.entries(dashboardData?.summaryData.distribution || {}).map(([range, value]) => (
                <div key={range} className="distribution-item">
                  <span className="dot" style={{ backgroundColor: neonColors[range.includes('0-25') ? 'pink' : range.includes('26-50') ? 'orange' : range.includes('51-75') ? 'blue' : 'green'] }}></span>
                  {range}: {value} listings
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review Links Chart */}
        <div className="chart-card">
          <h2 className="chart-title">Review Links Status</h2>
          <SafeChartRenderer 
            data={dashboardData?.reviewData} 
            title="Review Links"
          />
          <div className="review-summary">
            <h3>Review Links</h3>
            <div className="status-list">
              <div className="status-item">
                <span className="dot" style={{ backgroundColor: neonColors.green }}></span>
                <span className="status-label">Added:</span>
                <span className="status-value">{reviewStats.added || 0}</span>
              </div>
              <div className="status-item">
                <span className="dot" style={{ backgroundColor: neonColors.orange }}></span>
                <span className="status-label">Pending:</span>
                <span className="status-value">{reviewStats.pending || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <DashboardFooter stats={dashboardData?.stats} />
    </div>
  );
};

export default Dashboard;