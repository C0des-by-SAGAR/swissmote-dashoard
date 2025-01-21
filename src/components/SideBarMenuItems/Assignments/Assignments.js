import React, { useState, useEffect } from 'react';
import { FiCheck, FiClock } from 'react-icons/fi';
import './Assignments.css';
import ActiveListings from './AssignmentsActiveListings';
import AssignmentCard from './AssignmentCard';
import toast from 'react-hot-toast';
import { assignmentService } from '../../../api/services/assignmentService';
import { addAssignmentService } from '../../../api/services/addAssignmentService';
import { activeListingService } from '../../../api/services/activeListingService';

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
    </div>
  </div>
);

const Assignments = () => {
  const [selectedListing, setSelectedListing] = useState(null);
  const [selectedListingDetails, setSelectedListingDetails] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All Assignments');
  const [assignmentData, setAssignmentData] = useState({
    listing: '',
    link: ''
  });
  const [activeListings, setActiveListings] = useState([]);

  const fetchAssignments = async (page = 1) => {
    try {
      setIsLoading(true);
      const offset = (page - 1) * rowsPerPage;
      
      const response = await assignmentService.getAssignments({
        row_data: rowsPerPage,
        offset_data: offset
      });

      if (response) {
        setAssignments(response);
        setCurrentPage(page);
      }
    } catch (error) {
      toast.error('Failed to fetch assignments');
      console.error('Error fetching assignments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchActiveListings = async () => {
    try {
      const listings = await activeListingService.getActiveListings();
      setActiveListings(listings);
    } catch (error) {
      toast.error('Failed to fetch active listings');
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchActiveListings();
    fetchAssignments();
  }, []);

  const handleListingSelect = (listingId, listingDetails) => {
    setSelectedListing(listingId);
    setSelectedListingDetails(listingDetails);
  };

  const handlePageChange = (newPage) => {
    fetchAssignments(newPage);
  };

  const handleStatusChange = (assignmentId, newStatus) => {
    setAssignments(prevAssignments => 
      prevAssignments.map(assignment => 
        assignment.id === assignmentId 
          ? { ...assignment, status: newStatus }
          : assignment
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addAssignmentService.addAssignment(assignmentData);
      toast.success('Assignment added successfully');
      setAssignmentData({ listing: '', link: '' });
      fetchAssignments(); // Refresh the list
    } catch (error) {
      toast.error('Failed to add assignment');
      console.error('Error:', error);
    }
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
            </select>
            
            <input
              type="search"
              placeholder="Search by name..."
              className="pa2 br2 ba b--light-gray mr3"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {selectedListing && selectedListingDetails && (
          <div className="flex items-center gray mt2">
            <span className="f4 fw5 dark-gray">{selectedListingDetails.companyName}</span>
            <span className="mh2 f6">•</span>
            <span className="f5 moon-gray">{selectedListingDetails.role}</span>
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
            listings={activeListings}
          />
        </div>

        <div className="w-75">
          <StatusLegend />
          
          {isLoading ? (
            <div className="loading-spinner">Loading assignments...</div>
          ) : (
            <div className="assignments-grid">
              {assignments.map(assignment => (
                <AssignmentCard 
                  key={assignment.id}
                  assignment={assignment}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}

          {assignments.length === 0 && !isLoading && (
            <div className="empty-state pa4 tc">
              <p className="f4 gray mb3">No assignments found</p>
            </div>
          )}

          <div className="pagination-controls">
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={assignments.length < rowsPerPage}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Assignments;
