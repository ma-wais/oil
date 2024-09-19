import React, { useState } from 'react';
import axios from 'axios';
import { server } from '../App'; // Assuming `server` is already set up

const UpdateStock = ({  }) => {
  const [product, setProduct] = useState('');
  const [stockInKg, setStockInKg] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${server}/stock/${product}`, {
        stockInKg,
      });
      setMessage('Stock updated successfully');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating stock');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 border border-gray-200 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Update Product Stock</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Product</label>
           <select
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Select seed</option>
            <option value="sarson">Sarson</option>
            <option value="taramira">Taramira</option>
            <option value="banola">Banola</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Stock to Add (kg)</label>
          <input
            type="number"
            value={stockInKg}
            onChange={(e) => setStockInKg(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter stock in kg"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Submit
        </button>
        {message && <p className="text-red-500 mt-4">{message}</p>}
      </form>
    </div>
  );
};

export default UpdateStock;
