import React, { useMemo, useState, useEffect } from 'react';
import ListingsHeader from '../../shared/ListingsHeader';
import NotAutomatedListingCard from '../../shared/NotAutomatedListingCard';
import { notAutomatedListingsData } from './notAutomatedListingsData';
import './NotAutomatedListings.css';
import { autoListingsService } from '../../../../../api/services/autoListingsService';
import { toast } from 'react-toastify';

const NotAutomatedListings = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('internship');
  const [accountFilter, setAccountFilter] = useState('pv');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 9;
  const [isLoading, setIsLoading] = useState(true);
  const [listings, setListings] = useState([]);

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

  useEffect(() => {
    const fetchNotAutomatedListings = async () => {
      try {
        const data = await autoListingsService.getAutoListings({
          emp_type: 'all',
          account: 'all'
        });
        // Filter not automated listings
        const notAutomated = data.filter(listing => !listing.is_automated);
        setListings(notAutomated);
      } catch (error) {
        console.error('Error fetching not automated listings:', error);
        toast.error('Error fetching not automated listings');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotAutomatedListings();
  }, []);

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
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          listings.length === 0 ? (
            <div className="no-results">
              <p>No listings found matching your criteria</p>
            </div>
          ) : (
            paginatedData.map((listing, index) => (
              <NotAutomatedListingCard 
                key={`${listing.listingNo}-${index}`}
                data={listing}
              />
            ))
          )
        )}
      </div>

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