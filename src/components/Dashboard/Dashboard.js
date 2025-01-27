import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Area 
} from 'recharts';
import DashboardHeader from './DashboardHeader';
import DashboardFooter from './DashboardFooter';
import { dashboardGraphService } from '../../api/services/dashboardGraphService';
import './Dashboard.css';
import { toast } from 'react-hot-toast';

const LoadingDashboard = () => (
  <div className="dashboard-container bg-dark-blue p-6 rounded-lg">
    <h1 className="text-2xl font-bold mb-8">Welcome to Swissmote Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-light-blue p-6 rounded-lg animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="h-6 bg-gray-700 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  </div>
);

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

const Dashboard = () => {
  const [chartType, setChartType] = useState('Bar');
  const [graphData, setGraphData] = useState({
    followUpData: [],
    conversionData: [],
    reviewData: [],
    summaryData: {
      followUp: { day2: { sent: 0, pending: 0 }, day4: { sent: 0, pending: 0 } },
      distribution: { '0-25%': 0, '26-50%': 0, '51-75%': 0, '76-100%': 0 },
      reviews: { added: 0, pending: 0 }
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  const chartColors = {
    primary: '#4ECDC4',     // Cyan
    secondary: '#FF6B6B',   // Red
    tertiary: '#87D37C',    // Green
    quaternary: '#F7D794',  // Yellow
    quinary: '#FFB36B'      // Orange
  };

  const gradientOffset = () => {
    return {
      x1: "0",
      y1: "0",
      x2: "0",
      y2: "1"
    };
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  const fetchGraphData = async () => {
    try {
      setIsLoading(true);
      const response = await dashboardGraphService.getDashboardGraphData();
      
      // Transform the data for line chart to include multiple values
      const lineData = response.followUpData.map(item => ({
        name: item.name,
        value: item.value,
        value2: item.value * 0.8,
        value3: item.value * 0.6,
        value4: item.value * 0.4,
        value5: item.value * 0.2
      }));

      setGraphData({
        ...response,
        followUpData: lineData
      });
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const renderChart = (data) => {
    // Early return if no data is provided
    if (!data) return null;

    // Handle data based on chart type and data source
    const getChartData = () => {
      if (Array.isArray(data)) {
        return data;
      }
      
      if (data.chartTitle === 'Conversion Rate Distribution') {
        return graphData.conversionData || [];
      }
      
      if (data.chartTitle === 'Review Links Status') {
        return graphData.reviewData || [];
      }
      
      return [];
    };

    const chartData = getChartData();

    // Return null if no valid data
    if (!chartData.length) {
      return <div className="no-data-message">No data available</div>;
    }

    switch (chartType) {
      case 'Bar':
        return (
          <BarChart 
            data={chartData} 
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            width={500}
            height={300}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255, 255, 255, 0.05)"
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              stroke="#ffffff"
              tick={{ fill: '#ffffff', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            />
            <YAxis 
              stroke="#ffffff"
              tick={{ fill: '#ffffff', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
              domain={[0, dataMax => Math.max(4, dataMax)]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value">
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={Object.values(chartColors)[index % Object.values(chartColors).length]}
                />
              ))}
            </Bar>
          </BarChart>
        );

      case 'Line':
        return (
          <LineChart 
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255, 255, 255, 0.05)"
              horizontal={true}
              vertical={false}
            />
            <XAxis 
              dataKey="name" 
              stroke="#ffffff"
              tick={{ fill: '#ffffff', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            />
            <YAxis 
              stroke="#ffffff"
              tick={{ fill: '#ffffff', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255, 255, 255, 0.1)' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={chartColors.primary}
              strokeWidth={2}
              dot={{ fill: chartColors.primary, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );

      case 'Pie':
        return (
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={false}
              outerRadius={70}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`}
                  fill={Object.values(chartColors)[index % Object.values(chartColors).length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return <LoadingDashboard />;
  }

  return (
    <div className="dashboard-container">
      <DashboardHeader stats={graphData.summaryData} />
      
      {/* Global Chart Type Selector */}
      <div className="global-chart-selector">
        <div className="chart-type-label">Chart Type</div>
        <div className="chart-type-options">
          {['Bar', 'Pie', 'Line'].map((type) => (
            <button
              key={type}
              className={`chart-type-btn ${chartType === type ? 'active' : ''}`}
              onClick={() => setChartType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Charts Container - New horizontal scrolling wrapper */}
      <div className="horizontal-charts-wrapper">
        {/* Follow-up Status Chart */}
        <div className="chart-card">
          <div className="chart-header">
            <h2 className="chart-title">Follow-up Status</h2>
          </div>
          <div style={{ width: '100%', height: 300 }}>  {/* Add wrapper div with explicit dimensions */}
            <ResponsiveContainer>
              {renderChart(graphData.followUpData)}
            </ResponsiveContainer>
          </div>
          <div className="follow-up-stats">
            <div className="follow-up-column">
              <h3 className="follow-up-title">Day 2 Follow-ups</h3>
              <div className="stats-row">
                <span className="stat-label sent">Sent: </span>
                <span className="stat-value sent">{graphData.summaryData.followUp.day2.sent}</span>
              </div>
              <div className="stats-row">
                <span className="stat-label pending">Pending: </span>
                <span className="stat-value pending">{graphData.summaryData.followUp.day2.pending}</span>
              </div>
            </div>
            
            <div className="follow-up-column">
              <h3 className="follow-up-title">Day 4 Follow-ups</h3>
              <div className="stats-row">
                <span className="stat-label sent-day4">Sent: </span>
                <span className="stat-value sent-day4">{graphData.summaryData.followUp.day4.sent}</span>
              </div>
              <div className="stats-row">
                <span className="stat-label pending-day4">Pending: </span>
                <span className="stat-value pending-day4">{graphData.summaryData.followUp.day4.pending}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Conversion Rate Chart */}
        <div className="chart-card">
          <h2 className="chart-title">Conversion Rate Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            {renderChart({ chartTitle: 'Conversion Rate Distribution' })}
          </ResponsiveContainer>
          <div className="distribution-summary">
            <h3>Distribution</h3>
            <div className="distribution-list">
              {Object.entries(graphData.summaryData.distribution).map(([range, value], index) => (
                <div key={range} className="distribution-item">
                  <span className="dot" style={{ backgroundColor: Object.values(chartColors)[index] }}></span>
                  {range}: {value} listings
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Review Links Chart */}
        <div className="chart-card">
          <h2 className="chart-title">Review Links Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            {renderChart({ chartTitle: 'Review Links Status' })}
          </ResponsiveContainer>
          <div className="review-summary">
            <h3>Review Links</h3>
            <div className="status-list">
              <div className="status-item">
                <span className="dot" style={{ backgroundColor: chartColors.success }}></span>
                <span className="status-label">Added:</span>
                <span className="status-value">{graphData.summaryData.reviews.added}</span>
              </div>
              <div className="status-item">
                <span className="dot" style={{ backgroundColor: chartColors.warning }}></span>
                <span className="status-label">Pending:</span>
                <span className="status-value">{graphData.summaryData.reviews.pending}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DashboardFooter stats={graphData.summaryData} />
    </div>
  );
};

export default Dashboard;