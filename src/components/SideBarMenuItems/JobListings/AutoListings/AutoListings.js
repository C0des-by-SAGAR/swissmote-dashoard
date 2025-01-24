// src/components/SideBarMenuItems/JobListings/AutoListings/AutoListings.js
import React, { useState, useEffect } from 'react';
import Header from './AutoListingsHeader';
import AutomatedListings from './AutomatedListings/AutomatedListings';
import NotAutomatedListings from './NotAutomatedListings/NotAutomatedListings';
import ExpiredListings from './ExpiredListings/ExpiredListings';
import { automatedListingsData } from './AutomatedListings/automatedListingsData';
import { notAutomatedListingsData } from './NotAutomatedListings/notAutomatedListingsData';
import { expiredListingsData } from './ExpiredListings/expiredListingsData';
import './AutoListings.css';
import { autoListingsService } from '../../../../api/services/autoListingsService';
import { toast } from 'react-toastify';
import { listingSorterService } from '../../../../api/services/listingSorterService';

const AutoListings = () => {
  const [activeTab, setActiveTab] = useState('automated');
  const [isLoading, setIsLoading] = useState(false);
  const [listings, setListings] = useState({
    automated: [],
    notAutomated: [],
    expired: []
  });
  const [filters, setFilters] = useState({
    emp_type: 'job',
    account: 'pv',
    searchTerm: ''
  });

  const fetchListings = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching with filters:', filters);
      const response = await autoListingsService.getAutoListings(
        filters.emp_type,
        filters.account
      );
      console.log('API Response:', response);
      setListings({
        automated: response.filter(listing => listing.isAutomated),
        notAutomated: response.filter(listing => !listing.isAutomated),
        expired: response.filter(listing => new Date(listing.expiryDate) < new Date())
      });
    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch listings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [filters.emp_type, filters.account]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFilterChange = (newFilters) => {
    console.log('Filter change:', newFilters);
    const updatedFilters = {
      ...filters,
      emp_type: newFilters.employmentType || filters.emp_type,
      account: newFilters.account === 'Persist Ventures' ? 'pv' : 
              newFilters.account === 'Systemic Altruism' ? 'sa' : 
              filters.account,
      searchTerm: newFilters.searchTerm || filters.searchTerm
    };
    setFilters(updatedFilters);
  };

  const filteredListings = {
    automated: listings.automated.filter(listing =>
      listing.listingName.toLowerCase().includes(filters.searchTerm.toLowerCase())
    ),
    notAutomated: listings.notAutomated.filter(listing =>
      listing.listingName.toLowerCase().includes(filters.searchTerm.toLowerCase())
    ),
    expired: listings.expired.filter(listing =>
      listing.listingName.toLowerCase().includes(filters.searchTerm.toLowerCase())
    )
  };

  return (
    <div className="auto-listings-container">
      <Header
        activeTab={activeTab}
        onTabChange={handleTabChange}
        filters={{
          employmentType: filters.emp_type,
          account: filters.account === 'pv' ? 'Persist Ventures' : 
                  filters.account === 'sa' ? 'Systemic Altruism' : 
                  filters.account,
          searchTerm: filters.searchTerm
        }}
        onFilterChange={handleFilterChange}
        onFetchListings={fetchListings}
        isLoading={isLoading}
      />

      {activeTab === 'automated' && (
        <AutomatedListings listings={filteredListings.automated} />
      )}
      {activeTab === 'not-automated' && (
        <NotAutomatedListings listings={filteredListings.notAutomated} />
      )}
      {activeTab === 'expired' && (
        <ExpiredListings listings={filteredListings.expired} />
      )}
    </div>
  );
};

export default AutoListings;