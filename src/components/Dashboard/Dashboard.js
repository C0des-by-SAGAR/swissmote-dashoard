import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line 
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
        <p className="label">{`${label} : ${payload[0].value}`}</p>
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

  // Neon colors for charts
  const neonColors = {
    cyan: '#00ffff',
    magenta: '#ff00ff',
    green: '#39ff14',
    yellow: '#ffff00',
    orange: '#ff9100',
    pink: '#ff69b4'
  };

  useEffect(() => {
    fetchGraphData();
  }, []);

  const fetchGraphData = async () => {
    try {
      setIsLoading(true);
      const data = await dashboardGraphService.getDashboardGraphData();
      setGraphData(data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const renderChart = (data) => {
    // Ensure data exists and has length
    if (!data || data.length === 0) return null;

    switch (chartType) {
      case 'Bar':
        return (
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" stroke="#e2e8f0" />
            <YAxis stroke="#e2e8f0" domain={[0, 'auto']} allowDecimals={false} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="value" minPointSize={1}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={Object.values(neonColors)[index % Object.values(neonColors).length]} 
                />
              ))}
            </Bar>
          </BarChart>
        );
      case 'Pie':
        return (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={Object.values(neonColors)[index % Object.values(neonColors).length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        );
      case 'Line':
        return (
          <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
            <XAxis dataKey="name" stroke="#e2e8f0" />
            <YAxis stroke="#e2e8f0" />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="value" stroke={neonColors.cyan} />
          </LineChart>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <LoadingDashboard />;
  }

  return (
    <div className={`dashboard-container ${chartType === 'Pie' ? 'single-line' : ''}`}>
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

      {/* Follow-up Status Chart */}
      <div className="chart-card">
        <div className="chart-header">
          <h2 className="chart-title">Follow-up Status</h2>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          {graphData.followUpData && graphData.followUpData.length > 0 ? (
            renderChart(graphData.followUpData)
          ) : (
            <div className="no-data-message">No follow-up data available</div>
          )}
        </ResponsiveContainer>
        <div className="follow-up-summary">
          <h3>Day 2 Follow-ups</h3>
          <div className="status-list">
            <div className="status-item">
              <span className="dot" style={{ backgroundColor: neonColors.cyan }}></span>
              <span className="status-label">Sent:</span>
              <span className="status-value">{graphData.summaryData.followUp.day2.sent}</span>
            </div>
            <div className="status-item">
              <span className="dot" style={{ backgroundColor: neonColors.magenta }}></span>
              <span className="status-label">Pending:</span>
              <span className="status-value">{graphData.summaryData.followUp.day2.pending}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Rate Chart */}
      <div className="chart-card">
        <h2 className="chart-title">Conversion Rate Distribution</h2>
        <ResponsiveContainer width="100%" height={300}>
          {renderChart(graphData.conversionData)}
        </ResponsiveContainer>
        <div className="distribution-summary">
          <h3>Distribution</h3>
          <div className="distribution-list">
            {Object.entries(graphData.summaryData.distribution).map(([range, value], index) => (
              <div key={range} className="distribution-item">
                <span className="dot" style={{ backgroundColor: Object.values(neonColors)[index] }}></span>
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
          {renderChart(graphData.reviewData)}
        </ResponsiveContainer>
        <div className="review-summary">
          <h3>Review Links</h3>
          <div className="status-list">
            <div className="status-item">
              <span className="dot" style={{ backgroundColor: neonColors.green }}></span>
              <span className="status-label">Added:</span>
              <span className="status-value">{graphData.summaryData.reviews.added}</span>
            </div>
            <div className="status-item">
              <span className="dot" style={{ backgroundColor: neonColors.orange }}></span>
              <span className="status-label">Pending:</span>
              <span className="status-value">{graphData.summaryData.reviews.pending}</span>
            </div>
          </div>
        </div>
      </div>

      <DashboardFooter stats={graphData.summaryData} />
    </div>
  );
};

export default Dashboard;