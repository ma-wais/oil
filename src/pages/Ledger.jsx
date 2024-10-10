import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from '../App';

const LedgerPage = () => {
  const [ledgerRecords, setLedgerRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'cr', 'dr'
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  useEffect(() => {
    fetchLedgerRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [ledgerRecords, typeFilter, currentPage]);

  const fetchLedgerRecords = async () => {
    try {
      const response = await axios.get(`${server}/ledgerrecords`);
      setLedgerRecords(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching ledger records:', error);
    }
  };

  const filterRecords = () => {
    let records = ledgerRecords;
    if (typeFilter !== 'all') {
      records = ledgerRecords.filter(record => record.type === typeFilter);
    }
    const startIndex = (currentPage - 1) * recordsPerPage;
    const paginatedRecords = records.slice(startIndex, startIndex + recordsPerPage);
    setFilteredRecords(paginatedRecords);
  };

  const handleFilterChange = (type) => {
    setTypeFilter(type);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const totalPages = Math.ceil(
    ledgerRecords.filter(record => typeFilter === 'all' || record.type === typeFilter).length / recordsPerPage
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ledger Records</h1>

      {/* Filter Buttons */}
      <div className="mb-4">
        <button
          className={`px-4 py-2 mr-2 rounded ${typeFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleFilterChange('all')}
        >
          All
        </button>
        <button
          className={`px-4 py-2 mr-2 rounded ${typeFilter === 'cr' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleFilterChange('cr')}
        >
          CR Records
        </button>
        <button
          className={`px-4 py-2 rounded ${typeFilter === 'dr' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => handleFilterChange('dr')}
        >
          DR Records
        </button>
      </div>

      {/* Ledger Table */}
      <table className="w-full border-collapse border border-gray-300 my-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Contact Name</th>
            <th className="border border-gray-300 p-2">Amount</th>
            <th className="border border-gray-300 p-2">Description</th>
            <th className="border border-gray-300 p-2">Bill No</th>
            <th className="border border-gray-300 p-2">Date</th>
          </tr>
        </thead>
        <tbody>
          {filteredRecords.map((record, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{record.contactName}</td>
              <td className="border border-gray-300 p-2">{record.amount}</td>
              <td className="border border-gray-300 p-2">{record.description}</td>
              <td className="border border-gray-300 p-2">{record.billNo}</td>
              <td className="border border-gray-300 p-2">
                {new Date(record.date).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`px-3 py-1 mx-1 ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LedgerPage;
