import { useState } from 'react';

function SaleReport() {
  const [fromDate, setFromDate] = useState('05-09-2024');
  const [toDate, setToDate] = useState('05-09-2024');
  const [fromInvoice, setFromInvoice] = useState('');
  const [toInvoice, setToInvoice] = useState('');
  const [party, setParty] = useState('');
  const [product, setProduct] = useState('');

  return (
    <div className="p-6 bg-white shadow-md rounded-md w-full max-w-lg mx-auto">
      <h2 className="text-xl font-semibold mb-4">Sale Report</h2>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">From Invoice#</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={fromInvoice}
            onChange={(e) => setFromInvoice(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">To Invoice#</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={toInvoice}
            onChange={(e) => setToInvoice(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Party</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={party}
            onChange={(e) => setParty(e.target.value)}
          >
            <option value="">Select Party</option>
            <option value="Party 1">Party 1</option>
            <option value="Party 2">Party 2</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
          <select
            className="w-full p-2 border border-gray-300 rounded-md"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
          >
            <option value="">Select Product</option>
            <option value="Product 1">Product 1</option>
            <option value="Product 2">Product 2</option>
          </select>
        </div>
      </div>
      <div className="flex space-x-4">
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md">Show Report</button>
        <button className="bg-green-500 text-white py-2 px-4 rounded-md">Show Summary</button>
      </div>
    </div>
  );
}

export default SaleReport;
