import React, { useState, useEffect } from 'react';
import ListingsHeader from '../../shared/ListingsHeader';
import AutomatedListingCard from '../../shared/AutomatedListingCard';
import { listingsService } from '../../../../../api/services/listings';
import { toast } from 'react-toastify';
import './AutomatedListings.css';

const AutomatedListings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [employmentType, setEmploymentType] = useState('Jobs');
  const [account, setAccount] = useState('Persist Ventures');
  const [currentPage, setCurrentPage] = useState(1);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const cardsPerPage = 4;

  useEffect(() => {
    fetchListings();
  }, [employmentType, account]);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const response = await listingsService.getAutoListings({
        employmentType: employmentType.toLowerCase(),
        account: account === 'Persist Ventures' ? 'pv' : 'sa'
      });
      
      setListings(response.automated || []);
    } catch (error) {
      toast.error('Error fetching listings');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredListings = listings.filter(listing => {
    const matchesSearch = !searchQuery || 
      Object.values(listing).some(val => 
        String(val).toLowerCase().includes(searchQuery.toLowerCase())
      );
    return matchesSearch;
  });

  const totalPages = Math.ceil(filteredListings.length / cardsPerPage);
  const currentListings = filteredListings.slice(
    (currentPage - 1) * cardsPerPage,
    currentPage * cardsPerPage
  );

  return (
    <div className="automated-container">
      <div className="header-section">
        <div className="title-section">
          <h1 className="main-title">Automated Listings</h1>
          <p className="subtitle">View and manage all automated job listings</p>
        </div>

        <div className="filters-section">
          <div className="filter-group">
            <label>Search</label>
            <input 
              type="text" 
              placeholder="Search listings..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-group">
            <label>Employment Type</label>
            <select 
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="select-input"
            >
              <option value="Jobs">Jobs</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Account</label>
            <select 
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="select-input"
            >
              <option value="Persist Ventures">Persist Ventures</option>
              <option value="Systemic Altruism">Systemic Altruism</option>
            </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="loading">Loading listings...</div>
      ) : (
        <>
          <div className="listings-grid">
            {currentListings.map((listing) => (
              <AutomatedListingCard 
                key={listing.listingNumber} 
                data={listing} 
              />
            ))}
          </div>

          {filteredListings.length > 0 && (
            <div className="pagination">
              <button 
                className="pagination-button"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>
              <button 
                className="pagination-button"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AutomatedListings;