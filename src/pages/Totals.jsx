import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { server } from '../App';

const TotalBalance = () => {
  const [totalDr, setTotalDr] = useState(0);
  const [totalCr, setTotalCr] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTotals = async () => {
      try {
        const response = await axios.get(`${server}/contacts/total-balance`);
        setTotalDr(response.data.totalDr);
        setTotalCr(response.data.totalCr);
        setLoading(false);
      } catch (err) {
        setError("Error fetching total balance");
        setLoading(false);
      }
    };

    fetchTotals();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-slate-100 p-6 shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4 text-center">Total Balance Overview</h1>
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-gray-700">Total Banam (Dr):</span>
        <span className="text-lg font-bold text-blue-600">₹{totalDr}</span>
      </div>
      <div className="flex justify-between items-center mb-4">
        <span className="font-semibold text-gray-700">Total Jama (Cr):</span>
        <span className="text-lg font-bold text-red-600">₹{totalCr}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="font-semibold text-gray-700">Net Balance:</span>
        <span className={`text-lg font-bold ${totalDr - totalCr >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          ₹{totalDr - totalCr}
        </span>
      </div>
    </div>
  );
};

export default TotalBalance;
