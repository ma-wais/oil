import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { server } from '../App';

const options = [
  { value: "sarson", label: "Sarson" },
  { value: "taramira", label: "Taramira" },
  { value: "banola", label: "Banola" },
];

const StockSummaryReport = () => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [stockInfo, setStockInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedProduct) {
      fetchStockInfo();
    }
  }, [selectedProduct]);

  const fetchStockInfo = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${server}/products?name=${selectedProduct.value}`);
      setStockInfo(response.data[0]);
      console.log(response.data[0]);
    } catch (error) {
      setError('Error fetching stock information');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Current Stock Summary Report</h1>
      <Select
        options={options}
        value={selectedProduct}
        onChange={(value) => setSelectedProduct(value)}
        placeholder="Select a product"
        className="mb-4"
      />
      {loading && <p className="mt-4">Loading...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}
      {stockInfo && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-semibold">{stockInfo.name.toUpperCase()}</h2>
          <p>Current Stock: {stockInfo.stockInKg}</p>
        </div>
      )}
    </div>
  );
};

export default StockSummaryReport;