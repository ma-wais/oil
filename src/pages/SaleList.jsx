import React, { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDown, ChevronUp, Trash2, Printer } from "lucide-react";
import { server } from "../App";
import PrintableInvoice from "./PrintInvoice";
import ReactDOM from "react-dom";

const SalesInvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState("date");
  const [sortDirection, setSortDirection] = useState("asc");
  const itemsPerPage = 10;

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await axios.get(`${server}/sales`);
      setInvoices(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching invoices:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${server}/sale/${id}`);
      fetchInvoices();
      alert("Invoice deleted successfully");
    } catch (error) {
      alert("Error deleting invoice");
      console.error(error);
    }
  };

  const handleSort = (column) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const openPrintableInvoice = (invoiceData) => {
    console.log("Invoice data being passed to PrintableInvoice:", invoiceData);
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Invoice</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body>
          <div id="print-root"></div>
          <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
        </body>
      </html>
    `);
    printWindow.document.close();

    const renderAndPrint = () => {
      try {
        ReactDOM.render(
          <PrintableInvoice invoiceData={invoiceData} />,
          printWindow.document.getElementById('print-root'),
          () => {
            console.log("PrintableInvoice rendered in new window");
            printWindow.focus();
            setTimeout(() => {
              console.log("Attempting to print");
              printWindow.print();
            }, 1000);
          }
        );
      } catch (error) {
        console.error("Error rendering PrintableInvoice:", error);
        printWindow.document.body.innerHTML = `<h1>Error rendering invoice: ${error.message}</h1>`;
      }
    };

    if (printWindow.React && printWindow.ReactDOM) {
      renderAndPrint();
    } else {
      printWindow.onload = renderAndPrint;
    }
  };

  const sortedInvoices = [...invoices].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentInvoices = sortedInvoices.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderSortIcon = (column) => {
    if (sortColumn === column) {
      return sortDirection === "asc" ? (
        <ChevronUp size={16} />
      ) : (
        <ChevronDown size={16} />
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sale Invoice List</h1>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            {["Date", "Bill#", "Party", "Product", "Amount", "Action"].map(
              (header, index) => (
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
              )
            )}
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {currentInvoices.map((invoice) => (
            <tr
              key={invoice._id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {new Date(invoice.date).toLocaleDateString()}
              </td>
              <td className="py-3 px-6 text-left">{invoice.billNo}</td>
              <td className="py-3 px-6 text-left">{invoice.customerName}</td>
              <td className="py-3 px-6 text-left">
                {invoice &&invoice.items?.map((item) => item.description).join(", ") ||
                  "No Products"}
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
                    onClick={() => openPrintableInvoice(invoice)}
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
        {Array.from(
          { length: Math.ceil(invoices.length / itemsPerPage) },
          (_, i) => (
            <button
              key={i}
              onClick={() => paginate(i + 1)}
              className={`mx-1 px-3 py-1 rounded ${
                currentPage === i + 1 ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {i + 1}
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default SalesInvoiceList;
