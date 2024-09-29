import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { server } from '../App';

const CrushingRecords = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [contacts, setContacts] = useState([]);
  const [selectedParty, setSelectedParty] = useState(null);

  useEffect(() => {
    fetchRecords();
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${server}/contact?type=party`);
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchRecords = async () => {
    try {
      const response = await axios.get(`${server}/crushings`, {
        params: { 
          dateFrom, 
          dateTo,
          partyName: selectedParty ? selectedParty.value : ''
        },
      });
      setRecords(response.data);
    } catch (error) {
      setError('Error fetching crushing records');
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
        <label className="mr-2">Party: </label>
        <Select
          options={contacts.map((c) => ({
            value: c.name,
            label: c.name
          }))}
          onChange={setSelectedParty}
          value={selectedParty}
          className="w-[200px] mr-4"
          isClearable
        />
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
              <th className="border px-4 py-2">Party Name</th>
              <th className="border px-4 py-2">Seed Name</th>
              <th className="border px-4 py-2">Crushing Amount (mans)</th>
              <th className="border px-4 py-2">Total Left (mans)</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((record) => (
                <tr key={record._id}>
                  <td className="border px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{record.partyName}</td>
                  <td className="border px-4 py-2">{record.seedName}</td>
                  <td className="border px-4 py-2">{record.crushingAmount}</td>
                  <td className="border px-4 py-2">{record.totalLeft}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="border px-4 py-2" colSpan="5">
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