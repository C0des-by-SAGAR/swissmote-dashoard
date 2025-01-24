import React from 'react';
import './AutoListingsHeader.css';

const Header = ({ 
  activeTab, 
  onTabChange, 
  filters, 
  onFilterChange,
  onFetchListings,
  isLoading 
}) => {
  return (
    <div className="header-container">
      <div className="header-top mb4">
        <h1 className="f3 fw6 dark-gray mb2">Auto Listings</h1>
        <p className="f5 gray mv0">Manage and automate your job and internship listings efficiently.</p>
      </div>
      
      <div className="filters-container">
        <div className="filter-group">
          <label className="filter-label">Employment Type</label>
          <select 
            value={filters.employmentType}
            onChange={e => onFilterChange({ employmentType: e.target.value })}
            className="select-input"
            aria-label="Select employment type"
          >
            <option value="All">All Types</option>
            <option value="job">Job</option>
            <option value="internship">Internship</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Account</label>
          <select
            value={filters.account}
            onChange={e => onFilterChange({ account: e.target.value })}
            className="select-input"
            aria-label="Select account"
          >
            <option value="All">All Accounts</option>
            <option value="pv">Persist Ventures</option>
            <option value="sa">Systemic Altruism</option>
          </select>
        </div>

        <button 
          className="fetch-button"
          onClick={onFetchListings}
          disabled={isLoading}
          aria-label="Fetch listings"
        >
          {isLoading ? 'Fetching...' : 'Fetch Listings'}
        </button>
        
        <div className="search-group">
          <input 
            type="text" 
            value={filters.searchTerm} 
            onChange={e => onFilterChange({ searchTerm: e.target.value })} 
            placeholder="Type to Start Search..." 
            className="search-input"
          />
        </div>
      </div>
      
      <div className="tab-container">
        <button 
          className={`tab-button automated ${activeTab === 'automated' ? 'active' : ''}`}
          onClick={() => onTabChange('automated')}
        >
          Automated Listings
        </button>
        <button 
          className={`tab-button not-automated ${activeTab === 'not-automated' ? 'active' : ''}`}
          onClick={() => onTabChange('not-automated')}
        >
          Not Automated Listings
        </button>
        <button 
          className={`tab-button expired ${activeTab === 'expired' ? 'active' : ''}`}
          onClick={() => onTabChange('expired')}
        >
          Expired Listings
        </button>
      </div>
    </div>
  );
};

export default Header;