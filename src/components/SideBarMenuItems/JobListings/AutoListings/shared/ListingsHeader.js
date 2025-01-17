import React from 'react';
import './ListingsHeader.css';

const ListingsHeader = ({ title, subtitle, onSearch, onSortChange, onEmploymentTypeChange, onAccountChange }) => {
  const handleSearchChange = (e) => {
    onSearch(e.target.value);
  };

  const handleSortChange = (e) => {
    onSortChange(e.target.value);
  };

  const handleEmploymentTypeChange = (e) => {
    onEmploymentTypeChange(e.target.value);
  };

  const handleAccountChange = (e) => {
    onAccountChange(e.target.value);
  };

  return (
    <div className="ph4 pv4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="f2 fw6 mt0 mb2">{title}</h1>
          <p className="f4 mt0 mb4 gray">{subtitle}</p>
        </div>
        <div className="flex items-center w-100 w-third-l justify-end-l mt3 mt0-l">
          <div className="relative w-100 mw6 mr3">
            <input
              type="text"
              placeholder="Type to Start Search..."
              className="w-100 pa2 pr4 br2 ba b--black-20"
              onChange={handleSearchChange}
            />
          </div>
          <select 
            className="w-auto pa2 br2 ba b--black-20 bg-white"
            onChange={handleSortChange}
          >
            <option value="default">Default</option>
            <option value="listingName">Listing Name</option>
            <option value="projectName">Project Name</option>
          </select>
        </div>
      </div>

      <div className="flex align-items-center justify-between gap-1 mb4 pa3">
        <div className="flex flex-wrap items-center w-100">
          <div className="w-100 w-50-l pr3-l mb3 mb0-l">
            <label className="db f6 mb2">Employment Type</label>
            <select 
              className="w-100 pa2 br2 ba b--black-20 bg-white"
              onChange={handleEmploymentTypeChange}
            >
              <option value="job">Job</option>
              <option value="internship">Internship</option>
            </select>
          </div>
          <div className="w-100 w-50-l pl3-l">
            <label className="db f6 mb2">Account</label>
            <select 
              className="w-100 pa2 br2 ba b--black-20 bg-white"
              onChange={handleAccountChange}
            >
              <option value="pv">Persist Ventures</option>
              <option value="sa">Systemic Altruism</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingsHeader;