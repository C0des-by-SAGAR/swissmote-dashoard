import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';
import { expiredListingsData } from './expiredListingsData';
import './ExpiredListings.css';
import ListingsHeader from '../shared/ListingsHeader';

const ExpiredListings = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [employmentType, setEmploymentType] = useState('job');
  const [account, setAccount] = useState('pv');
  
  // Filter data based on search, employment type and account
  const filteredData = useMemo(() => {
    return expiredListingsData.filter(item => {
      const matchesSearch = !globalFilter || 
        Object.values(item).some(val => 
          String(val).toLowerCase().includes(globalFilter.toLowerCase())
        );
        
      const matchesAccount = 
        (account === 'pv' && item.createdBy.includes('Persist Ventures')) ||
        (account === 'sa' && item.createdBy.includes('Systemic Altruism'));

      const matchesEmploymentType = 
        (employmentType === 'internship' && item.postedOver.toLowerCase().includes('internship')) ||
        (employmentType === 'job' && !item.postedOver.toLowerCase().includes('internship'));

      return matchesSearch && matchesAccount && matchesEmploymentType;
    });
  }, [globalFilter, employmentType, account]);

  const columns = useMemo(
    () => [
      {
        header: 'Organisation',
        accessorKey: 'organisation',
        cell: ({ row }) => {
          const createdBy = row.original.createdBy;
          return createdBy.includes('Persist Ventures') ? 'Persist Ventures' : 'Systemic Altruism';
        },
      },
      {
        header: 'Listing Number',
        accessorKey: 'listingNumber',
      },
      {
        header: 'Project Name',
        accessorKey: 'projectName',
      },
      {
        header: 'Posted Date',
        accessorKey: 'postedDate',
      },
      {
        header: 'Posted Over',
        accessorKey: 'postedOver',
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
        header: 'Total Applications',
        accessorKey: 'totalApplications',
      },
      {
        header: 'Assignment Links',
        accessorKey: 'assignmentLinks',
        cell: ({ row }) => (
          <a href={row.original.assignmentLinks} className="link blue hover-dark-blue">
            View Assignment
          </a>
        ),
      },
      {
        header: 'Review Links',
        accessorKey: 'reviewLinks',
        cell: ({ getValue }) => (
          <span className={getValue() === "No Links" ? "gray" : "blue"}>
            {getValue()}
          </span>
        ),
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

  const handleSearch = (searchValue) => {
    setGlobalFilter(searchValue);
  };

  const handleSortChange = (sortValue) => {
    if (sortValue === 'default') {
      setSorting([]);
      return;
    }
    setSorting([{ id: sortValue, desc: false }]);
  };

  const handleEmploymentTypeChange = (type) => {
    setEmploymentType(type);
  };

  const handleAccountChange = (selectedAccount) => {
    setAccount(selectedAccount);
  };

  return (
    <div className="expired-listings-container">
      <div className="expired-header-wrapper">
        <ListingsHeader
          title="Expired Listings"
          subtitle="View and manage all expired job listings"
          onSearch={handleSearch}
          onSortChange={handleSortChange}
          onEmploymentTypeChange={handleEmploymentTypeChange}
          onAccountChange={handleAccountChange}
        />
      </div>

      <div className="expired-table-container">
        <table className="expired-listings-table">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id}>
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
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="expired-pagination">
        <button
          className="pagination-button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <span className="pagination-info">
          Page {table.getState().pagination.pageIndex + 1} of{' '}
          {table.getPageCount()}
        </span>
        <button
          className="pagination-button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default ExpiredListings;