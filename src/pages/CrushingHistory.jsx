import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { server } from '../App';

const CrushingRecords = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]); // For storing filtered data
  const [error, setError] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [seedName, setSeedName] = useState(''); // New state for seed name filter

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    filterRecords();
  }, [seedName, records]);

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

  const filterRecords = () => {
    if (seedName === '') {
      setFilteredRecords(records); // If no seedName is selected, show all records
    } else {
      setFilteredRecords(records.filter((record) => record.seedName === seedName));
    }
  };

  const handleSearch = () => {
    fetchRecords();
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Crushing Records</h2>
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="mb-4 flex items-center">
        <label className="mr-2">Date From: </label>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="border px-2 py-1 mr-4"
        />
        <label className="mr-2">Date To: </label>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="border px-2 py-1 mr-4"
        />
        <label className="mr-2">Seed Name: </label>
        <select
          value={seedName}
          onChange={(e) => setSeedName(e.target.value)}
          className="border px-2 py-1 mr-4"
        >
          <option value="">All</option>
          <option value="sarson">Sarson</option>
          <option value="taramira">Taramira</option>
          <option value="banola">Banola</option>
        </select>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded"
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
              <th className="border px-4 py-2">Crushing Amount (mans)</th>
              <th className="border px-4 py-2">Total Left (mans)</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
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
