import React, { useMemo, useState, useRef } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';
import ListingsHeader from '../shared/ListingsHeader';
import { automatedListingsData } from './automatedListingsData';
import './AutomatedListings.css';
import { createPortal } from 'react-dom';

// Simplified ActionsCell component
const ActionsCell = React.memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  return (
    <div style={{ position: 'relative' }}>
      <button 
        ref={buttonRef}
        onClick={handleClick}
        style={{
          background: '#f1f5f9',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          fontSize: '20px',
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '4px'
        }}
      >
        ⋮
      </button>
      {isOpen && createPortal(
        <div 
          style={{
            position: 'fixed',
            top: buttonRef.current?.getBoundingClientRect().bottom + 5,
            left: buttonRef.current?.getBoundingClientRect().left - 180,
            background: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
            borderRadius: '8px',
            width: '220px',
            zIndex: 9999,
            padding: '8px 0'
          }}
        >
          <button 
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#4a5568',
              display: 'block'
            }}
          >
            Post Assignment
          </button>
          <button 
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#4a5568',
              display: 'block'
            }}
          >
            Make Announcement
          </button>
          <button 
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#4a5568',
              display: 'block'
            }}
          >
            Add Review
          </button>
          <button 
            style={{
              width: '100%',
              textAlign: 'left',
              padding: '10px 16px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              color: '#4a5568',
              display: 'block'
            }}
          >
            Edit Follow-Up Message
          </button>
        </div>,
        document.body
      )}
    </div>
  );
});

ActionsCell.displayName = 'ActionsCell';

const AutomatedListings = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [employmentType, setEmploymentType] = useState('job');
  const [account, setAccount] = useState('pv');
  const data = useMemo(() => automatedListingsData, []);

  // Filter data based on search, employment type and account
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesSearch = !globalFilter || 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(globalFilter.toLowerCase())
        );
        
      const matchesAccount = 
        (account === 'pv' && item.organization === 'Persist Ventures') ||
        (account === 'sa' && item.organization === 'Systemic Altruism');

      // For this example, we'll consider listings with "Internship" in name as internships
      const matchesEmploymentType = 
        (employmentType === 'internship' && item.listingName.toLowerCase().includes('internship')) ||
        (employmentType === 'job' && !item.listingName.toLowerCase().includes('internship'));

      return matchesSearch && matchesAccount && matchesEmploymentType;
    });
  }, [data, globalFilter, employmentType, account]);

  const columns = useMemo(
    () => [
      {
        header: 'Organization',
        accessorKey: 'organization',
      },
      {
        header: 'Listing Name',
        accessorKey: 'listingName',
      },
      {
        header: 'Project Name',
        accessorKey: 'projectName',
      },
      {
        header: 'Date',
        accessorKey: 'date',
      },
      {
        header: 'Posted Over',
        accessorKey: 'postedOver',
      },
      {
        header: 'Conversion Rate',
        accessorKey: 'conversionRate',
        cell: ({ getValue }) => `${getValue()}%`,
      },
      {
        header: 'Assignments Received',
        accessorKey: 'assignmentsReceived',
      },
      {
        header: 'Assignments Sent',
        accessorKey: 'assignmentsSent',
      },
      {
        header: 'New Applicants',
        accessorKey: 'newApplicants',
      },
      {
        header: 'Total Applications',
        accessorKey: 'totalApplications',
      },
      {
        header: 'Assignment Links',
        accessorKey: 'assignmentLinks',
        cell: ({ row }) => (
          <div className="flex flex-column">
            {row.original.assignmentLinks.map((link, index) => (
              <a key={index} href={link} className="link blue hover-dark-blue mb1">
                Link {index + 1}
              </a>
            ))}
          </div>
        ),
      },
      {
        header: 'Review Links',
        accessorKey: 'reviewLinks',
        cell: ({ row }) => (
          row.original.reviewLinks === 'No Review Links' ? 
          <span>{row.original.reviewLinks}</span> :
          <a href={row.original.reviewLinks} className="link blue hover-dark-blue">
            Review Link
          </a>
        ),
      },
      {
        header: 'Intro Message',
        accessorKey: 'introMessage',
      },
      {
        header: 'Assignment Message',
        accessorKey: 'assignmentMessage',
      },
      {
        header: 'Day-2 Followup',
        accessorKey: 'day2Followup',
        cell: ({ row }) => (
          <div className="flex items-center">
            <span className="bg-gold pa1 br2 mr2 f7">Pending</span>
            <span>{row.original.day2Followup}</span>
          </div>
        ),
      },
      {
        header: 'Day-4 Followup',
        accessorKey: 'day4Followup',
        cell: ({ row }) => (
          <div className="flex items-center">
            <span className="automated-status-badge automated-status-pending">Pending</span>
            <span className="ml2">{row.original.day4Followup}</span>
          </div>
        ),
      },
      {
        header: 'Expiry Date',
        accessorKey: 'expiryDate',
      },
      {
        header: 'Created By',
        accessorKey: 'createdBy',
      },
      {
        header: 'Automated By',
        accessorKey: 'automatedBy',
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: () => <ActionsCell />
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="automated-container">
      <div className="automated-header-wrapper">
        <ListingsHeader 
          title="Automated Listings"
          subtitle="Manage and track your automated job listings efficiently"
          onSearch={setGlobalFilter}
          onEmploymentTypeChange={(value) => setEmploymentType(value)}
          onAccountChange={(value) => setAccount(value)}
          onSortChange={(value) => {
            // Set sorting based on the selected column
            setSorting([{ id: value, desc: false }]);
          }}
        />
      </div>

      <div className="automated-table-container">
        <table className="automated-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className={header.id === 'actions' ? 'automated-actions-column' : ''}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td 
                    key={cell.id}
                    className={cell.column.id === 'actions' ? 'automated-actions-column' : ''}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="automated-pagination">
        <button
          className="automated-pagination-button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <span className="automated-pagination-info">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <button
          className="automated-pagination-button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AutomatedListings;