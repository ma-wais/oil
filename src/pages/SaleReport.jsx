import React, { useState } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp, Printer } from 'lucide-react';
import { server } from '../App';

const SalesReport = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [billNo, setBillNo] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [itemName, setItemName] = useState('');
  const [reportData, setReportData] = useState([]);
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${server}/sales`, {
        params: { startDate, endDate, billNo, customerName, itemName }
      });
      setReportData(response.data);
    } catch (error) {
      console.error('Error fetching sale report:', error);
    }
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedReportData = [...reportData].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    }
    return null;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sales Report</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Bill No.</label>
            <input
              type="text"
              value={billNo}
              onChange={(e) => setBillNo(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Customer Name</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block mb-2">Item Name</label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Generate Report
        </button>
      </form>

      {reportData.length > 0 && (
        <>
          <button
            onClick={handlePrint}
            className="mb-4 bg-green-500 text-white p-2 rounded hover:bg-green-600 flex items-center"
          >
            <Printer size={16} className="mr-2" /> Print Report
          </button>
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                {['Date', 'Bill#', 'Customer', 'Items', 'Total Amount'].map((header, index) => (
                  <th
                    key={index}
                    className="py-3 px-6 text-left cursor-pointer"
                    onClick={() => handleSort(header.toLowerCase().replace('#', 'No').replace(' ', ''))}
                  >
                    <div className="flex items-center">
                      {header}
                      {renderSortIcon(header.toLowerCase().replace('#', 'No').replace(' ', ''))}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {sortedReportData.map((invoice) => (
                <tr key={invoice._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {new Date(invoice.date).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-6 text-left">{invoice.billNo}</td>
                  <td className="py-3 px-6 text-left">{invoice.customerName}</td>
                  <td className="py-3 px-6 text-left">
                    {invoice.items.map((item) => item.description).join(', ')}
                  </td>
                  <td className="py-3 px-6 text-left">{invoice.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default SalesReport;