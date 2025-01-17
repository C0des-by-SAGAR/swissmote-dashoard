import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';
import { notAutomatedListingsData } from './notAutomatedListingsData';
import ListingsHeader from '../shared/ListingsHeader';
import './NotAutomatedListings.css';

const NotAutomatedListings = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const [employmentTypeFilter, setEmploymentTypeFilter] = useState('');
  const [accountFilter, setAccountFilter] = useState('');
  
  // Filter the data based on employment type and account
  const data = useMemo(() => {
    let filteredData = [...notAutomatedListingsData];
    
    if (employmentTypeFilter) {
      filteredData = filteredData.filter(item => 
        item.employmentType === employmentTypeFilter
      );
    }
    
    if (accountFilter) {
      filteredData = filteredData.filter(item => 
        item.organisation === (accountFilter === 'pv' ? 'Persist Ventures' : 'Systemic Altruism')
      );
    }
    
    return filteredData;
  }, [employmentTypeFilter, accountFilter]);

  const columns = useMemo(
    () => [
      {
        header: 'Organisation',
        accessorKey: 'organisation',
      },
      {
        header: 'Listing Name',
        accessorKey: 'listingName',
      },
      {
        header: 'Listing Number',
        accessorKey: 'listingNumber',
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
        header: 'Actions',
        accessorKey: 'actions',
        cell: () => (
          <button className="automate-button">
            Automate
          </button>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
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

  // Handler functions for ListingsHeader
  const handleSearch = (value) => {
    setGlobalFilter(value);
  };

  const handleSortChange = (value) => {
    setSorting([{ id: value, desc: false }]);
  };

  const handleEmploymentTypeChange = (value) => {
    setEmploymentTypeFilter(value);
  };

  const handleAccountChange = (value) => {
    setAccountFilter(value);
  };

  return (
    <div className="not-automated-listings-container">
      <ListingsHeader 
        title="Not Automated Listings"
        subtitle="Manage your manual job and internship listings efficiently."
        onSearch={handleSearch}
        onSortChange={handleSortChange}
        onEmploymentTypeChange={handleEmploymentTypeChange}
        onAccountChange={handleAccountChange}
      />

      <div className="table-scroll-container">
        <table className="not-automated-listings-table">
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

      <div className="pagination">
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

export default NotAutomatedListings;