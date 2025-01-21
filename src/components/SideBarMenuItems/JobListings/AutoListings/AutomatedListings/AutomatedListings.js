import React, { useState, useEffect } from 'react';
import AutomatedListingCard from '../../shared/AutomatedListingCard';
import ListingDetailsModal from './ListingDetailsModal';
import { toast } from 'react-toastify';
import './AutomatedListings.css';
import { automatedListingsData } from './automatedListingsData';
import { autoListingsService } from '../../../../../api/services/autoListingsService';
import { automatedListingService } from '../../../../../api/services/automatedListingService';

const AutomatedListings = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [employmentType, setEmploymentType] = useState('Jobs');
  const [account, setAccount] = useState('Persist Ventures');
  const [currentPage, setCurrentPage] = useState(1);
  const [listings, setListings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const cardsPerPage = 4;
  const [formData, setFormData] = useState({
    username: '',
    listing: '',
    listingName: '',
    name: '',
    process: 'assignment',
    postOver: 'startupathon or normal',
    assignmentLink: '',
    inviteMessage: '',
    followup2: '',
    followup4: '',
    designation: 'intern',
    empType: 'job or in',
    ctc: '10,000',
    account: 'pv or sa'
  });

  // Add new state for daily updates
  const [dailyUpdates, setDailyUpdates] = useState({});
  const [isLoadingUpdates, setIsLoadingUpdates] = useState(false);

  useEffect(() => {
    fetchListings();
  }, [employmentType, account]);

  // Add new effect for fetching updates when a listing is selected
  useEffect(() => {
    if (selectedListing?.listingId) {
      fetchDailyUpdates(selectedListing.listingId);
    }
  }, [selectedListing]);

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      const response = await autoListingsService.getAutoListings({
        emp_type: employmentType.toLowerCase(),
        account: account.toLowerCase()
      });
      
      // Set listings from the automated section of the response
      setListings(response.automated || []);
    } catch (error) {
      toast.error('Error fetching automated listings');
      console.error('Error:', error);
      setListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDailyUpdates = async (listingId) => {
    try {
      setIsLoadingUpdates(true);
      const updates = await automatedListingService.getDailyUpdates({
        listing: listingId
      });
      setDailyUpdates(prev => ({
        ...prev,
        [listingId]: updates
      }));
    } catch (error) {
      toast.error('Error fetching daily updates');
      console.error('Error:', error);
    } finally {
      setIsLoadingUpdates(false);
    }
  };

  const handleViewDetails = (listing) => {
    if (!listing) {
      toast.error('Listing details not available');
      return;
    }
    setSelectedListing(listing);
  };

  const handleCloseModal = () => {
    setSelectedListing(null);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await automatedListingService.createAutomatedListing(formData);
      toast.success('Listing automated successfully!');
      console.log('Automated listing response:', response);
      
      // Reset form after successful submission
      setFormData({
        username: '',
        listing: '',
        listingName: '',
        name: '',
        process: 'assignment',
        postOver: 'startupathon or normal',
        assignmentLink: '',
        inviteMessage: '',
        followup2: '',
        followup4: '',
        designation: 'intern',
        empType: 'job or in',
        ctc: '10,000',
        account: 'pv or sa'
      });
    } catch (error) {
      toast.error('Failed to automate listing: ' + error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
                key={`${listing.listingName}-${listing.date}`}
                data={listing}
                onViewDetails={() => handleViewDetails(listing)}
              />
            ))}
          </div>

          {/* Modal with null check */}
          {selectedListing && selectedListing.listingName && (
            <ListingDetailsModal 
              data={selectedListing}
              dailyUpdates={dailyUpdates[selectedListing.listingId]}
              isLoadingUpdates={isLoadingUpdates}
              onClose={handleCloseModal}
            />
          )}

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

      <div className="header-section">
        <div className="title-section">
          <h1 className="main-title">Create Automated Listing</h1>
          <p className="subtitle">Set up a new automated job listing</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="pa4 bg-dark-gray br3 mt4">
        <div className="flex flex-wrap">
          {/* Basic Information */}
          <div className="w-50-l w-100 pr3-l mb3">
            <label className="f6 db mb2 white-70">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="search-input w-100"
              required
            />
          </div>

          {/* Add all other form fields following the same pattern */}
          {/* ... */}

          <div className="w-100 mt4">
            <button 
              type="submit"
              className="f6 link dim br2 ph4 pv2 dib white bg-blue bn pointer"
            >
              Create Automated Listing
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AutomatedListings;