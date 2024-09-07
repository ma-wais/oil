import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronDown, ChevronUp, Trash2, Printer } from 'lucide-react';
import { server } from '../App';

const PurchaseInvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState('asc');
  const itemsPerPage = 10;

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${server}/purchase`);
      setInvoices(response.data);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${server}/purchase/${id}`);
      fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const handlePrint = (invoice) => {
    console.log('Printing invoice:', invoice);
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedInvoices = [...invoices].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = sortedInvoices.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Purchase Invoice List</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            {['Date', 'Bill#', 'Party', 'Product', 'Amount', 'Action'].map((header, index) => (
              <th
                key={index}
                className="py-3 px-6 text-left cursor-pointer"
                onClick={() => handleSort(header.toLowerCase())}
              >
                <div className="flex items-center">
                  {header}
                  {renderSortIcon(header.toLowerCase())}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {currentInvoices.map((invoice) => (
            <tr key={invoice._id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {new Date(invoice.date).toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-left">{invoice.invoiceNumber}</td>
              <td className="py-3 px-6 text-left">{invoice.partyName}</td>
              <td className="py-3 px-6 text-left">
                {invoice.items.map((item) => item.description).join(', ')}
              </td>
              <td className="py-3 px-6 text-left">{invoice.grandTotal}</td>
              <td className="py-3 px-6 text-left">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleDelete(invoice._id)}
                    className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                  <button
                    onClick={() => handlePrint(invoice)}
                    className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                  >
                    <Printer size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-center mt-4">
        {Array.from({ length: Math.ceil(invoices.length / itemsPerPage) }, (_, i) => (
          <button
            key={i}
            onClick={() => paginate(i + 1)}
            className={`mx-1 px-3 py-1 rounded ${
              currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PurchaseInvoiceList;