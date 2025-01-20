import React, { useMemo, useState } from 'react';
import ListingsHeader from '../../shared/ListingsHeader';
import ListingCard from '../../shared/ListingCard';
import NotAutomatedListingCard from '../../shared/NotAutomatedListingCard';
import { notAutomatedListingsData } from './notAutomatedListingsData';
import './NotAutomatedListings.css';

const NotAutomatedListings = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('');
  const [accountFilter, setAccountFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9;
  
  // Filter the data based on employment type and account
  const filteredData = useMemo(() => {
    let filtered = [...notAutomatedListingsData];
    
    if (globalFilter) {
      filtered = filtered.filter(item => 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(globalFilter.toLowerCase())
        )
      );
    }
    
    if (employmentTypeFilter) {
      filtered = filtered.filter(item => 
        item.employmentType === employmentTypeFilter
      );
    }
    
    if (accountFilter) {
      filtered = filtered.filter(item => 
        item.organisation === (accountFilter === 'pv' ? 'Persist Ventures' : 'Systemic Altruism')
      );
    }
    
    return filtered;
  }, [globalFilter, employmentTypeFilter, accountFilter]);

  // Calculate pagination
  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="not-automated-container">
      <div className="not-automated-header-wrapper">
        <ListingsHeader 
          title="Not Automated Listings"
          subtitle="Manage your manual job and internship listings efficiently"
          onSearch={setGlobalFilter}
          onEmploymentTypeChange={setEmploymentTypeFilter}
          onAccountChange={setAccountFilter}
        />
      </div>

      <div className="listings-grid">
        {paginatedData.map((listing, index) => (
          <NotAutomatedListingCard 
            key={`${listing.listingNo}-${index}`}
            data={listing}
          />
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className="no-results">
          <p>No listings found matching your criteria</p>
        </div>
      )}

      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {currentPage + 1} of {pageCount}
        </span>
        <button
          className="pagination-button"
          onClick={() => setCurrentPage(prev => Math.min(pageCount - 1, prev + 1))}
          disabled={currentPage === pageCount - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default NotAutomatedListings;