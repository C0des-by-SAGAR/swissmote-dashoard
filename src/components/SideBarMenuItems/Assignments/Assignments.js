import React, { useState, useEffect } from 'react';
import { FiCheck, FiClock, FiCalendar } from 'react-icons/fi';
import { MdDownload } from 'react-icons/md';
import './Assignments.css';
import ActiveListings from './AssignmentsActiveListings';
import { assignmentsService } from '../../../api/services/assignments';
import AssignmentCard from './AssignmentCard';
import { toast } from 'react-toastify';

const StatusLegend = () => (
  <div className="status-legend pa4 mb4 bg-white br3 shadow-1">
    <h4 className="f5 fw6 mt0 mb3 gray">Status Legend:</h4>
    <div className="flex items-center flex-wrap">
      <div className="flex items-center mr4 mb2">
        <FiCheck className="mr2 green" size={18} />
        <span className="f6 dark-gray">Evaluated</span>
      </div>
      <div className="flex items-center mr4 mb2">
        <FiClock className="mr2 orange" size={18} />
        <span className="f6 dark-gray">Pending</span>
      </div>
      <div className="flex items-center mb2">
        <FiCalendar className="mr2 blue" size={18} />
        <span className="f6 dark-gray">Future</span>
      </div>
    </div>
  </div>
);

const Assignments = () => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All Assignments');

  useEffect(() => {
    if (selectedListing) {
      fetchAssignments();
    }
  }, [selectedListing, refreshKey]);

  const fetchAssignments = async () => {
    try {
      setIsLoading(true);
      const response = await assignmentsService.getAssignments({
        listingId: selectedListing,
        source: 'pv', // or 'sa' based on your needs
        newData: 1,
        offsetDate: 0
      });
      setAssignments(response || []);
    } catch (error) {
      toast.error('Error fetching assignments');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleListingSelect = (listingId) => {
    setSelectedListing(listingId);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="pa4">
      <div className="mb4">
        <div className="flex justify-between items-center mb3">
          <div className="flex items-center">
            <h1 className="f3 fw6 mv0">Assignments Dashboard</h1>
            <span className="ml3 f6 bg-light-blue blue br2 ph3 pv1">
              {assignments.length} Assignments
            </span>
          </div>
          <div className="flex items-center">
            <select 
              className="custom-dropdown mr3 pa2 br2 ba b--light-gray bg-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option>All Assignments</option>
              <option>Evaluated</option>
              <option>Pending</option>
              <option>Future</option>
            </select>
            
            <input
              type="search"
              placeholder="Search by name..."
              className="pa2 br2 ba b--light-gray mr3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <button 
              className="f6 link dim br2 ph3 pv2 dib white bg-blue bn pointer"
              onClick={handleRefresh}
            >
              Refresh
            </button>
          </div>
        </div>

        {selectedListing && (
          <div className="flex items-center gray mt2">
            <span className="f4 fw5 dark-gray">{selectedListing}</span>
            <span className="mh2 f6">•</span>
            <span className="f5 moon-gray">#{selectedListing}</span>
          </div>
        )}
      </div>

      <div className="flex">
        <div className="w-25 pr4">
          <ActiveListings
            selectedListing={selectedListing}
            onListingSelect={handleListingSelect}
          />
        </div>

        <div className="w-75">
          <StatusLegend />
          
          {isLoading ? (
            <div className="loading-spinner">Loading assignments...</div>
          ) : (
            <div className="assignments-grid" key={refreshKey}>
              {assignments.map(assignment => (
                <AssignmentCard 
                  key={assignment.id}
                  assignment={assignment}
                  onStatusChange={handleRefresh}
                />
              ))}
            </div>
          )}

          {assignments.length === 0 && !isLoading && (
            <div className="empty-state pa4 tc">
              <p className="f4 gray mb3">No assignments found</p>
              {selectedListing && (
                <button 
                  className="refresh-button"
                  onClick={handleRefresh}
                >
                  Refresh
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Assignments;
