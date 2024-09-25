import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { server } from '../App';

const CrushingRecords = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const fetchRecords = async () => {
    try {
      const response = await axios.get(`${server}/crushings`, {
        params: { dateFrom, dateTo },
      });
      setRecords(response.data);
    } catch (error) {
      setError('Error fetching crushing records');
    }
  };

  const handleSearch = () => {
    fetchRecords();
  };

  useEffect(() => {
    fetchRecords(); // Initial fetch
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Crushing Records</h2>
      {error && <p className="text-red-500">{error}</p>}
      
      {/* Date Filter Inputs */}
      <div className="mb-4">
        <label className="mr-2">Date From: </label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="border px-2 py-1"
        />
        <label className="mx-2">Date To: </label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="border px-2 py-1"
        />
        <button
          onClick={handleSearch}
          className="ml-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Search
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Seed Name</th>
              <th className="border px-4 py-2">Crushing Amount (kg)</th>
              <th className="border px-4 py-2">Total Left (kg)</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((record) => (
                <tr key={record._id}>
                  <td className="border px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{record.seedName}</td>
                  <td className="border px-4 py-2">{record.crushingAmount}</td>
                  <td className="border px-4 py-2">{record.totalLeft}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border px-4 py-2" colSpan="4">
                  No records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CrushingRecords;
