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

const AutoListings = () => {
  const [activeTab, setActiveTab] = useState('automated');
  const [filters, setFilters] = useState({
    employmentType: 'All',
    account: 'All',
    searchTerm: ''
  });
  const [filteredAutomatedListings, setFilteredAutomatedListings] = useState(automatedListingsData);
  const [filteredNotAutomatedListings, setFilteredNotAutomatedListings] = useState(notAutomatedListingsData);
  const [filteredExpiredListings, setFilteredExpiredListings] = useState(expiredListingsData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const filterListings = () => {
      // Filter automated listings
      let filteredAuto = automatedListingsData;
      let filteredNotAuto = notAutomatedListingsData;

      // Filter by employment type
      if (filters.employmentType !== 'All') {
        filteredAuto = filteredAuto.filter(listing => 
          listing.employmentType === filters.employmentType
        );
        filteredNotAuto = filteredNotAuto.filter(listing => 
          listing.employmentType.toLowerCase() === filters.employmentType.toLowerCase()
        );
      }

      // Filter by account
      if (filters.account !== 'All') {
        filteredAuto = filteredAuto.filter(listing => 
          listing.organization === filters.account
        );
        filteredNotAuto = filteredNotAuto.filter(listing => 
          listing.organisation === filters.account
        );
      }

      // Filter by search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredAuto = filteredAuto.filter(listing =>
          listing.listingName.toLowerCase().includes(searchLower) ||
          listing.projectName.toLowerCase().includes(searchLower) ||
          listing.organization.toLowerCase().includes(searchLower)
        );
        filteredNotAuto = filteredNotAuto.filter(listing =>
          listing.listingName.toLowerCase().includes(searchLower) ||
          listing.organisation.toLowerCase().includes(searchLower)
        );
      }

      setFilteredAutomatedListings(filteredAuto);
      setFilteredNotAutomatedListings(filteredNotAuto);
    };

    filterListings();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const fetchListings = async (empType, account) => {
    try {
      setIsLoading(true);
      const data = await autoListingsService.getAutoListings(
        empType.toLowerCase(), 
        account === 'Persist Ventures' ? 'pv' : 'sa'
      );

      // Transform the API response to match our component's data structure
      const transformedListings = data.map(listing => ({
        listingName: listing.listing_name,
        listingNumber: listing.listing_number,
        expiryDate: listing.expiry_date,
        projectName: listing.projectname,
        organization: listing.posted_over.includes('Persist') ? 'Persist Ventures' : 'Systemic Altruism',
        employmentType: empType,
        metrics: listing.metrics,
        conversionRate: listing.conversion_rate,
        assignmentLink: listing.assignment_link?.[0] || '',
        reviewLink: listing.review_link || [],
        platformData: listing.platform_data,
        messages: listing.messages
      }));

      setFilteredAutomatedListings(transformedListings);
      
      toast.success('Listings fetched successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to fetch listings');
      setFilteredAutomatedListings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchListings = async () => {
    const empType = filters.employmentType === 'All' ? 'Job' : filters.employmentType;
    const account = filters.account === 'All' ? 'Persist Ventures' : filters.account;
    await fetchListings(empType, account);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'automated':
        return <AutomatedListings listings={filteredAutomatedListings} />;
      case 'not-automated':
        return <NotAutomatedListings listings={filteredNotAutomatedListings} />;
      case 'expired':
        return <ExpiredListings listings={filteredExpiredListings} />;
      default:
        return <AutomatedListings listings={filteredAutomatedListings} />;
    }
  };

  return (
    <div className="auto-listings-container">
      <Header 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        filters={filters}
        onFilterChange={handleFilterChange}
        onFetchListings={handleFetchListings}
        isLoading={isLoading}
      />
      {renderTabContent()}
    </div>
  );
};

export default AutoListings;