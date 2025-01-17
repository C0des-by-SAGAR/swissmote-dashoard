import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender
} from '@tanstack/react-table';
import { ClosedListingsData } from './closedlistingsdata';
import './ClosedListings.css';

const ClosedListings = () => {
  const [globalFilter, setGlobalFilter] = useState('');
  const [sorting, setSorting] = useState([]);
  const data = useMemo(() => ClosedListingsData, []);

  const columns = useMemo(
    () => [
      {
        header: 'Organisation',
        accessorKey: 'organisation',
      },
      {
        header: 'Listing No',
        accessorKey: 'listingNo',
      },
      {
        header: 'Process',
        accessorKey: 'process',
      },
      {
        header: 'Designation',
        accessorKey: 'designation',
      },
      {
        header: 'Date',
        accessorKey: 'date',
      },
      {
        header: 'Created By',
        accessorKey: 'createdBy',
      },
      {
        header: 'Created Platform',
        accessorKey: 'createdPlatform',
      },
      {
        header: 'Automated By',
        accessorKey: 'automatedBy',
      },
      {
        header: 'Automated Platform',
        accessorKey: 'automatedPlatform',
      },
      {
        header: 'Expiry Date',
        accessorKey: 'expiryDate',
      },
      {
        header: 'Conversion Rate',
        accessorKey: 'conversionRate',
        cell: ({ getValue }) => `${getValue()}%`,
      },
      {
        header: 'Internshala Link',
        accessorKey: 'internshalaLink',
        cell: ({ row }) => (
          <a href={row.original.internshalaLink} className="link blue hover-dark-blue">
            View Applications
          </a>
        ),
      },
      {
        header: 'Leader Link',
        accessorKey: 'leaderLink',
        cell: ({ row }) => (
          <a href={row.original.leaderLink} className="link blue hover-dark-blue">
            Leader Bot
          </a>
        ),
      },
      {
        header: 'Candidate Link',
        accessorKey: 'candidateLink',
        cell: ({ row }) => (
          <a href={row.original.candidateLink} className="link blue hover-dark-blue">
            Candidate Bot
          </a>
        ),
      },
      {
        header: 'Assignment Links',
        accessorKey: 'assignmentLinks',
        cell: ({ row }) => (
          <a href={row.original.assignmentLinks} className="link blue hover-dark-blue">
            {row.original.assignmentType || 'Loom Recording'}
          </a>
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

  return (
    <div className="active-listings-container">
      <div className="listings-header">
        <h1 className="listings-title">Closed Listings</h1>
        <div className="header-controls">
          <div className="search-container">
            <input
              type="text"
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search..."
              className="search-input"
            />
          </div>
          <div className="sort-container">
            <select 
              className="sort-select"
              onChange={(e) => {
                const [id, desc] = e.target.value.split('-');
                setSorting([{ id, desc: desc === 'desc' }]);
              }}
            >
              <option value="">Sort By</option>
              <option value="date-asc">Date (Oldest First)</option>
              <option value="date-desc">Date (Newest First)</option>
              <option value="organisation-asc">Organization (A-Z)</option>
              <option value="organisation-desc">Organization (Z-A)</option>
              <option value="listingNo-asc">Listing No. (Low to High)</option>
              <option value="listingNo-desc">Listing No. (High to Low)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="table-scroll-container">
        <table className="active-listings-table">
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

export default ClosedListings;
