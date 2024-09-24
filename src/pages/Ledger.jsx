import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from '../App';

const LedgerPage = () => {
  const [ledgerRecords, setLedgerRecords] = useState([]);

  useEffect(() => {
    fetchLedgerRecords();
  }, []);

  const fetchLedgerRecords = async () => {
    try {
      const response = await axios.get(`${server}/ledgerrecords`);
      setLedgerRecords(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching ledger records:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ledger Records</h1>
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
          {ledgerRecords.map((record, index) => (
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
    </div>
  );
};

export default LedgerPage;
