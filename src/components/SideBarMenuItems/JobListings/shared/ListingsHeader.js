import React from 'react';
import './ListingsHeader.css';

const ListingsHeader = ({
  title,
  subtitle,
  onSearch,
  onEmploymentTypeChange,
  onAccountChange,
  onSortChange
}) => {
  return (
    <div className="listings-header">
      <div className="listings-header-text">
        <h1 className="listings-title">{title}</h1>
        {subtitle && <p className="listings-subtitle">{subtitle}</p>}
      </div>
      
      <div className="header-controls">
        <div className="search-container">
          <label htmlFor="search" className="filter-label">Search</label>
          <input
            id="search"
            type="text"
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search listings..."
            className="search-input"
          />
        </div>

        {onEmploymentTypeChange && (
          <div className="filter-container">
            <label htmlFor="employment-type" className="filter-label">Employment Type</label>
            <select
              id="employment-type"
              className="filter-select"
              onChange={(e) => onEmploymentTypeChange(e.target.value)}
              defaultValue="job"
            >
              <option value="job">Jobs</option>
              <option value="internship">Internships</option>
            </select>
          </div>
        )}

        {onAccountChange && (
          <div className="filter-container">
            <label htmlFor="account" className="filter-label">Account</label>
            <select
              id="account"
              className="filter-select"
              onChange={(e) => onAccountChange(e.target.value)}
              defaultValue="pv"
            >
              <option value="pv">Persist Ventures</option>
              <option value="sa">Systemic Altruism</option>
            </select>
          </div>
        )}

        {onSortChange && (
          <div className="filter-container">
            <label htmlFor="sort" className="filter-label">Sort By</label>
            <select 
              id="sort"
              className="filter-select"
              onChange={onSortChange}
              defaultValue=""
            >
              <option value="">Default</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="date-desc">Date (Newest First)</option>
              <option value="organisation-asc">Organization (A-Z)</option>
              <option value="organisation-desc">Organization (Z-A)</option>
              <option value="listingNo-asc">Listing No. (Low to High)</option>
              <option value="listingNo-desc">Listing No. (High to Low)</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListingsHeader; 