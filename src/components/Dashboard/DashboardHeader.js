import React from 'react';
import './DashboardHeader.css';

const StatsCard = ({ icon, count, label, color }) => (
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

const DashboardHeader = ({ stats }) => {
  const statsConfig = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
          <path d="M20 6H16V4C16 2.89 15.11 2 14 2H10C8.89 2 8 2.89 8 4V6H4C2.89 6 2 6.89 2 8V19C2 20.11 2.89 21 4 21H20C21.11 21 22 20.11 22 19V8C22 6.89 21.11 6 20 6ZM10 4H14V6H10V4Z" fill="currentColor"/>
        </svg>
      ),
      count: stats?.totalJobs || 0,
      label: "Total Jobs",
      color: "cyan"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
          <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="currentColor"/>
        </svg>
      ),
      count: stats?.automatedListings || 0,
      label: "Automated Listings",
      color: "green"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
          <path d="M13 3C8.03 3 4 7.03 4 12H1L4.89 15.89L4.96 16.03L9 12H6C6 8.13 9.13 5 13 5C16.87 5 20 8.13 20 12C20 15.87 16.87 19 13 19C11.07 19 9.32 18.21 8.06 16.94L6.64 18.36C8.27 19.99 10.51 21 13 21C17.97 21 22 16.97 22 12C22 7.03 17.97 3 13 3Z" fill="currentColor"/>
        </svg>
      ),
      count: stats?.notAutomatedListings || 0,
      label: "Not Automated Listings",
      color: "yellow"
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" fill="currentColor"/>
        </svg>
      ),
      count: stats?.expiredListings || 0,
      label: "Expired Listings",
      color: "magenta"
    }
  ];

  return (
    <div className="dashboard-header-container">
      <h1 className="dashboard-title">Welcome to Swissmote Dashboard</h1>
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
