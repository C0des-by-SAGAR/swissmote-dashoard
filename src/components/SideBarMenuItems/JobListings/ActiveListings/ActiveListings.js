import React, { useState, useEffect } from 'react';
import { activeListingService } from '../../../../api/services/activeListingService';
import { toast } from 'react-toastify';

const sortOptions = [
  { value: 'default', label: 'Sort By' },
  { value: 'dateDesc', label: 'Newest First' },
  { value: 'dateAsc', label: 'Oldest First' },
  { value: 'organisationAsc', label: 'Organisation (A-Z)' },
  { value: 'organisationDesc', label: 'Organisation (Z-A)' },
  { value: 'listingNoAsc', label: 'Listing No (Asc)' },
  { value: 'listingNoDesc', label: 'Listing No (Desc)' },
  { value: 'conversionRate', label: 'Conversion Rate' }
];

const ITEMS_PER_PAGE = 6;

const ActiveListings = () => {
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchActiveListings();
  }, []);

  const fetchActiveListings = async () => {
    try {
      setIsLoading(true);
      const loadingToast = toast.loading('Fetching active listings...');
      
      const activeListings = await activeListingService.getActiveListings();
      setListings(activeListings.map(listing => ({
        id: listing.id,
        listingNo: listing.id.toString(),
        projectName: listing.projectName,
        organisation: listing.organisation,
        process: listing.process,
        designation: listing.designation,
        expiryDate: listing.expiryAt,
        createdBy: listing.platformData.createdBy,
        createdPlatform: listing.platformData.createdByPlatform,
        conversionRate: listing.conversionRate.replace('%', ''),
        internshalaLink: listing.internshalaLink,
        leaderLink: listing.leaderLink,
        candidateLink: listing.candidateLink,
        assignmentLinks: listing.assignmentLink[0],
        date: listing.date
      })));

      toast.update(loadingToast, {
        render: 'Listings fetched successfully!',
        type: 'success',
        isLoading: false,
        autoClose: 3000
      });
    } catch (error) {
      toast.error(error.message || 'Failed to fetch listings');
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  // Filter and sort data
  const filteredAndSortedData = listings
    .filter(item => 
      Object.values(item).some(value => 
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'dateDesc':
          return new Date(b.date) - new Date(a.date);
        case 'dateAsc':
          return new Date(a.date) - new Date(b.date);
        case 'organisationAsc':
          return a.organisation.localeCompare(b.organisation);
        case 'organisationDesc':
          return b.organisation.localeCompare(a.organisation);
        case 'listingNoAsc':
          return a.listingNo.localeCompare(b.listingNo);
        case 'listingNoDesc':
          return b.listingNo.localeCompare(a.listingNo);
        case 'conversionRate':
          return parseInt(b.conversionRate) - parseInt(a.conversionRate);
        default:
          return 0;
      }
    });

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredAndSortedData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="job-listings-container">
      {/* Header */}
      <div className="flex justify-between items-center mb4">
        <h1 className="f2 fw6 white-90">Active Listings</h1>
        <div className="flex items-center">
          <input
            type="search"
            placeholder="Search..."
            className="mr3 pa2 input-reset ba b--black-20 br2 bg-white-10 white-80"
            style={{ width: '300px' }}
            value={searchQuery}
            onChange={handleSearchChange}
            aria-label="Search listings"
          />
          <select
            value={sortBy}
            onChange={handleSortChange}
            className="pa2 input-reset ba b--black-20 br2 bg-white-10 white-80 pointer"
            aria-label="Sort listings"
          >
            {sortOptions.map(option => (
              <option 
                key={option.value} 
                value={option.value}
                className="bg-near-black"
                disabled={option.value === 'default'}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="listings-grid">
        {paginatedData.map(listing => (
          <div key={listing.id} className="listing-card">
            <div className="card-header">
              <h3 className="card-title">{listing.projectName}</h3>
              <span className="listing-number">#{listing.listingNo}</span>
            </div>
            
            <div className="card-content">
              <div className="info-row">
                <div className="info-label">Organisation</div>
                <div className="info-value">{listing.organisation}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Process</div>
                <div className="info-value">{listing.process}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Designation</div>
                <div className="info-value">{listing.designation}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Expiry Date</div>
                <div className="info-value">{listing.expiryDate}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Created By</div>
                <div className="info-value">{listing.createdBy}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Platform</div>
                <div className="info-value">{listing.createdPlatform}</div>
              </div>
              <div className="info-row">
                <div className="info-label">Conversion Rate</div>
                <div className="info-value">{listing.conversionRate}%</div>
              </div>
            </div>

            <div className="card-footer">
              <div><a href={listing.internshalaLink} className="link-button">Internshala</a></div>
              <div><a href={listing.leaderLink} className="link-button">Leader Bot</a></div>
              <div><a href={listing.candidateLink} className="link-button">Candidate</a></div>
              <div><a href={listing.assignmentLinks} className="link-button">Assignment</a></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-button"
          >
            Previous
          </button>
          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-button"
          >
            Next
          </button>
        </div>
      )}

      {paginatedData.length === 0 && (
        <div className="job-no-results">
          <p>No active listings found.</p>
        </div>
      )}
    </div>
  );
};

export default ActiveListings;
