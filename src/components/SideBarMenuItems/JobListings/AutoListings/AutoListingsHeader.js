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
  const handleEmploymentTypeChange = (e) => {
    const value = e.target.value.toLowerCase();
    onFilterChange({ 
      employmentType: value,
      emp_type: value
    });
    // Trigger fetch when employment type changes
    onFetchListings();
  };

  const handleAccountChange = (e) => {
    const displayValue = e.target.value;
    const apiValue = displayValue === 'Persist Ventures' ? 'pv' : 'sa';
    onFilterChange({ 
      account: apiValue,
      accountDisplay: displayValue
    });
    // Trigger fetch when account changes
    onFetchListings();
  };

  // Search only affects client-side filtering
  const handleSearchChange = (e) => {
    onFilterChange({ searchTerm: e.target.value });
  };

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
            onChange={handleEmploymentTypeChange}
            className="select-input"
          >
            <option value="internship">Internship</option>
            <option value="job">Job</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label className="filter-label">Account</label>
          <select
            value={filters.accountDisplay}
            onChange={handleAccountChange}
            className="select-input"
          >
            <option value="Persist Ventures">Persist Ventures</option>
            <option value="Systemic Altruism">Systemic Altruism</option>
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
            onChange={handleSearchChange}
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