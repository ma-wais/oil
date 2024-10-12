import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../App";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import PrintableInvoice from "./PrintInvoice";
import ReactDOM from "react-dom";

const Ledger = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [name, setName] = useState("");
  const [contacts, setContacts] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${server}/contact`);
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleCustomerChange = (selectedOption) => {
    setName(selectedOption.value);
    setSelectedOption(selectedOption);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!dateFrom || !dateTo || !name) {
      alert("Please select all date fields");
      return;
    }
    navigate("/ledger-results", {
      state: { dateFrom, dateTo, accountName: name },
    });
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">Account Ledger</h2>
      <form className="space-y-4 mt-4">
        <div>
          <label className="block text-sm font-medium">Date From</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Date To</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Name
          </label>
          <Select
            options={contacts.map((c) => ({
              value: c.name,
              label: `${c.name} (Balance: ${c.openingDr})`,
            }))}
            onChange={handleCustomerChange}
            value={selectedOption}
            className="w-[400px]"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-2 rounded"
        >
          Search
        </button>
      </form>
    </div>
  );
};

const LedgerResults = () => {
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previousBalance, setPreviousBalance] = useState(0);
  const { state } = useLocation();
  const { dateFrom, dateTo, accountName } = state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const subtractOneDay = (dateString) => {
          const date = new Date(dateString);
          date.setDate(date.getDate() - 1);
          return date.toISOString().split('T')[0];
        };
  
        const previousDateTo = subtractOneDay(dateFrom);
  
        const [
          saleResponse,
          purchaseResponse,
          ledgerRecordsResponse,
          prevSaleResponse,
          prevPurchaseResponse,
          prevLedgerRecordsResponse,
          contactResponse
        ] = await Promise.all([
          axios.get(`${server}/sale`, {
            params: { dateFrom, dateTo, customerName: accountName },
          }),
          axios.get(`${server}/ledger`, {
            params: { dateFrom, dateTo, partyName: accountName },
          }),
          axios.get(`${server}/ledgerrecords`, {
            params: { dateFrom, dateTo, customerName: accountName },
          }),
          axios.get(`${server}/sale`, {
            params: { dateTo: previousDateTo, customerName: accountName },
          }),
          axios.get(`${server}/ledger`, {
            params: { dateTo: previousDateTo, partyName: accountName },
          }),
          axios.get(`${server}/ledgerrecords`, {
            params: { dateTo: previousDateTo, customerName: accountName },
          }),
          axios.get(`${server}/contact`, {
            params: { name: accountName },
          })
        ]);

        const sales = saleResponse.data.map(sale => ({ ...sale, entryType: 'sale' }));
        const purchases = purchaseResponse.data.map(purchase => ({ ...purchase, entryType: 'purchase' }));
        const ledgerRecords = ledgerRecordsResponse.data;
        
        const prevSales = prevSaleResponse.data;
        const prevPurchases = prevPurchaseResponse.data;
        const prevLedgerRecords = prevLedgerRecordsResponse.data;
        // console.log(prevSales, prevPurchases, prevLedgerRecords);

        const contact = contactResponse.data;

        const allEntries = [...sales, ...purchases, ...ledgerRecords].sort((a, b) => new Date(a.date) - new Date(b.date));
        setLedgerEntries(allEntries);
        console.log(allEntries);

        const prevSalesTotal = prevSales.reduce((sum, sale) => sum + (sale.grandTotal || 0), 0);
        const prevPurchasesTotal = prevPurchases.reduce((sum, purchase) => sum + (purchase.grandTotal || 0), 0);
        const prevLedgerRecordsTotal = prevLedgerRecords.reduce((sum, record) => {
          if (record.type === 'dr') return sum + record.amount;
          if (record.type === 'cr') return sum - record.amount;
          return sum;
        }, 0);

        const openingBalance = (contact.openingDr || 0) - (contact.openingCr || 0);
        const calculatedPreviousBalance = openingBalance + prevSalesTotal - prevPurchasesTotal + prevLedgerRecordsTotal;
        setPreviousBalance(calculatedPreviousBalance);

        console.log("Previous Balance:", calculatedPreviousBalance);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [dateFrom, dateTo, accountName]);
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  let runningBalance = previousBalance;

  const openPrintableInvoice = (invoiceData) => {
    console.log("Invoice data being passed to PrintableInvoice:", invoiceData);

    const printWindow = window.open("", "_blank");
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
          printWindow.document.getElementById("print-root"),
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

  const calculateTotals = () => {
    let totalDebit = 0;
    let totalCredit = 0;

    ledgerEntries.forEach(entry => {
      if (entry.entryType === 'sale' || (entry.type === 'dr' && !entry.entryType)) {
        totalDebit += entry.grandTotal || entry.amount || 0;
      } else if (entry.entryType === 'purchase' || (entry.type === 'cr' && !entry.entryType)) {
        totalCredit += entry.grandTotal || entry.amount || 0;
      }
    });

    return { totalDebit, totalCredit };
  };

  const { totalDebit, totalCredit } = calculateTotals();

  return (
    <div className="p-4 max-w-[1000px] mx-auto">
      <div className="flex justify-between">
        <h2 className="text-2xl my-4 font-bold ">Oil Kohlu</h2>
        <h4 className="text-2xl font-bold my-4">Account Ledger</h4>
      </div>
      <p className="text-right">
        <b>From</b> {dateFrom} <b>to</b> {dateTo}
      </p>
      {/* Display current date and time */}
      <p className="text-right">
        <b>Current Date and Time:</b> {new Date().toLocaleDateString()}{" "}
        {new Date().toLocaleTimeString()} <br />
      </p>
      <p>
        <b>Name:</b> {accountName || "N/A"}
      </p>

      {/* Ledger Table */}
      <table className="table-auto w-full mt-5">
        <thead>
          <tr>
            <th className="border bg-slate-200 px-2 py-2">#</th>
            <th className="border bg-slate-200 px-2 py-2">Date</th>
            <th className="border bg-slate-200 px-2 py-1">Bill</th>
            <th className="border bg-slate-200 px-2 py-2">Entry</th>
            <th className="border bg-slate-200 py-2">Disc</th>
            {/* <th className="border bg-slate-200 px-2 py-2">Name</th> */}
            <th className="border bg-slate-200 px-2 py-2">Banam</th>
            <th className="border bg-slate-200 px-2 py-2">Jama</th>
            <th colspan="2" className="border bg-slate-200 py-2">
              Remaining
            </th>
          </tr>
          <tr>
            <th className="border px-2 py-2 text-right" colSpan={6}>
              Previous
            </th>
            <th className="border px-2 py-2" colSpan={2}>
              {previousBalance}
            </th>
          </tr>
        </thead>
        <tbody>
          {ledgerEntries.map((entry, index) => {
            let amount = 0;
            if (entry.entryType === 'sale') {
              amount = entry.grandTotal;
              runningBalance += amount;
            } else if (entry.entryType === 'purchase') {
              amount = entry.grandTotal;
              runningBalance -= amount;
            } else {
              // Ledger record
              amount = entry.amount;
              if (entry.type === 'dr') {
                runningBalance += amount;
              } else if (entry.type === 'cr') {
                runningBalance -= amount;
              }
            }

            return (
              <tr key={entry._id}>
                <td className="border px-2 py-2">{index + 1}</td>
                <td className="border px-1 py-2">
                  {new Date(entry.date).toLocaleDateString()}
                </td>
                <td
                  className="border px-2 py-1"
                  onClick={() => {
                    if (entry.entryType === 'sale' || entry.entryType === 'purchase') {
                      openPrintableInvoice(entry);
                    }
                  }}
                  style={{ cursor: entry.entryType === 'sale' || entry.entryType === 'purchase' ? "pointer" : "default" }}
                >
                  {entry.billNo || entry.invoiceNumber || "N/A"}
                </td>
                <td className="border px-2 py-2">
                  {entry.entryType && entry.entryType}
                  {entry.type === 'dr' && 'Banam'}
                  {entry.type === 'cr' && 'Jama'}
                </td>
                <td className="border px-2 py-1" style={{ whiteSpace: "nowrap", fontSize: "12px" }}>
                  {entry.items && entry.items.map((item, index) => (
                    <span key={index}>
                      {item.description}&nbsp;&nbsp;
                      {/* {item.quantity}&nbsp;
                      {item.weight}&nbsp;{item.rate}@&nbsp;
                      {item.total} */}
                      {index < entry.items.length - 1 ? ", " : ""}
                    </span>
                  ))}
                  {!entry.items && entry.description}
                </td>
                <td className="border px-2 py-2">
                  {(entry.entryType === 'sale' || (entry.type === 'dr' && !entry.entryType)) ? amount.toFixed(2) : "0.00"}
                </td>
                <td className="border px-2 py-2">
                  {(entry.entryType === 'purchase' || (entry.type === 'cr' && !entry.entryType)) ? amount.toFixed(2) : "0.00"}
                </td>
                <td className="border px-2 py-2">
                  {runningBalance.toFixed(2)}
                </td>
                <td className="border px-2 py-2">
                  {runningBalance > 0 ? "Banam" : "Jama"}
                </td>
              </tr>
            );
          })}

          <tr className="border px-2 py-2 font-bold text-right" colspan={9}>
            {" "}
          </tr>
          <tr>
            <td className="border px-2 py-2 font-bold text-right" colSpan={4}>
              Total
            </td>
            <td className="border px-2 py-2 font-bold">
              {totalDebit.toFixed(2)}
            </td>
            <td className="border px-2 py-2 font-bold">
              {totalCredit.toFixed(2)}
            </td>
            <td className="border px-2 py-2 font-bold" colSpan={2}>
              {runningBalance.toFixed(2)}
            </td>
          </tr>
          <tr colspan={9}></tr>
          <tr>
            <td colspan={7} className="border bg-slate-200 px-2 py-2 font-bold">
              Current Balance
            </td>
            <td rowSpan={1} className="border bg-slate-200 px-2 py-2 font-bold">
              {runningBalance.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export { Ledger, LedgerResults };
