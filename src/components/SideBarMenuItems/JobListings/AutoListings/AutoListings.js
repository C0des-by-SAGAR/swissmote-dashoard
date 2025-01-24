// src/components/SideBarMenuItems/JobListings/AutoListings/AutoListings.js
import React, { useState, useEffect } from 'react';
import Header from './AutoListingsHeader';
import AutomatedListings from './AutomatedListings/AutomatedListings';
import NotAutomatedListings from './NotAutomatedListings/NotAutomatedListings';
import ExpiredListings from './ExpiredListings/ExpiredListings';
import './AutoListings.css';
import { listingSorterService } from '../../../../api/services/listingSorterService';
import { toast } from 'react-toastify';

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
      const sortedListings = await listingSorterService.getAllSortedListings(
        filters.emp_type,
        filters.account
      );

      setListings(sortedListings);
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
    const updatedFilters = {
      ...filters,
      emp_type: newFilters.employmentType || filters.emp_type,
      account: newFilters.account || filters.account,
      searchTerm: newFilters.searchTerm ?? filters.searchTerm // Use nullish coalescing
    };
    setFilters(updatedFilters);
  };

  // Safe filtering function
  const safeFilter = (list, searchTerm) => {
    if (!Array.isArray(list)) return [];
    if (!searchTerm) return list;
    
    return list.filter(listing => {
      const listingName = listing?.listingName || listing?.title || '';
      return listingName.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const filteredListings = {
    automated: safeFilter(listings.automated, filters.searchTerm),
    notAutomated: safeFilter(listings.notAutomated, filters.searchTerm),
    expired: safeFilter(listings.expired, filters.searchTerm)
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
        <AutomatedListings 
          listings={filteredListings.automated || []} 
        />
      )}
      {activeTab === 'not-automated' && (
        <NotAutomatedListings 
          listings={filteredListings.notAutomated || []} 
        />
      )}
      {activeTab === 'expired' && (
        <ExpiredListings 
          listings={filteredListings.expired || []} 
        />
      )}
    </div>
  );
};

export default AutoListings;