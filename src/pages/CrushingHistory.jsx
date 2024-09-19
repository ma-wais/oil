import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { server } from '../App';

const CrushingRecords = () => {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState('');

  const fetchRecords = async () => {
    try {
      const response = await axios.get(`${server}/crushings`);
      setRecords(response.data);
    } catch (error) {
      setError('Error fetching crushing records');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <div className="max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Crushing Records</h2>
      {error && <p className="text-red-500">{error}</p>}
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
