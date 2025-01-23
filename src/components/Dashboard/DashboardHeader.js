import React from 'react';
import './DashboardHeader.css';

const StatsCard = ({ icon, count = 0, label = '', color = '' }) => (
  <div className="stats-card">
    <div className={`stats-icon ${color}`}>
      {icon}
    </div>
    <div className="stats-content">
      <h2 className="stats-count">{count}</h2>
      <p className="stats-label">{label}</p>
    </div>
  </div>
);

const DashboardHeader = ({ stats = {} }) => {
  // Provide default values to prevent undefined errors
  const {
    totalJobs = 0,
    automatedListings = 0,
    notAutomatedListings = 0,
    expiredListings = 0
  } = stats;

  const statsConfig = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-6-8h6m-6-4h6" />
        </svg>
      ),
      count: totalJobs,
      label: 'Total Jobs',
      color: 'blue'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
      count: automatedListings,
      label: 'Automated Listings',
      color: 'green'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3" />
        </svg>
      ),
      count: notAutomatedListings,
      label: 'Not Automated Listings',
      color: 'yellow'
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m-6-8h6m-6-4h6" />
        </svg>
      ),
      count: expiredListings,
      label: 'Expired Listings',
      color: 'red'
    }
  ];

  return (
    <div className="dashboard-header">
      <h1>Welcome to Swissmote Dashboard</h1>
      <div className="stats-grid">
        {statsConfig.map((stat, index) => (
          <StatsCard
            key={index}
            icon={stat.icon}
            count={stat.count}
            label={stat.label}
            color={stat.color}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardHeader;
