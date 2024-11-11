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

  const calculateBalance = (contact) => {
    const dr = parseFloat(contact.openingDr || 0);
    const cr = parseFloat(contact.openingCr || 0);
    return dr - cr;
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
              label: `${c.name} (Balance: ${calculateBalance(c).toFixed(2)})`,
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
          return date.toISOString().split("T")[0];
        };

        const previousDateTo = subtractOneDay(dateFrom);

        const [ledgerRecordsResponse, prevLedgerRecordsResponse, contactResponse] = 
          await Promise.all([
            axios.get(`${server}/ledgerrecords`, {
              params: { dateFrom, dateTo, customerName: accountName }
            }),
            axios.get(`${server}/ledgerrecords`, {
              params: { dateTo: previousDateTo, customerName: accountName }
            }),
            axios.get(`${server}/contact`, {
              params: { name: accountName }
            })
          ]);

        const ledgerRecords = ledgerRecordsResponse.data;
        const prevLedgerRecords = prevLedgerRecordsResponse.data;
        const contact = contactResponse.data;

        const allEntries = [...ledgerRecords].sort(
          (a, b) => new Date(a.date) - new Date(b.date)
        );
        setLedgerEntries(allEntries);
        console.log(allEntries);

        const prevLedgerRecordsTotal = prevLedgerRecords.reduce((sum, record) => {
          const amount = parseFloat(record.amount || 0);
          return record.type === "dr" ? sum + amount : sum - amount;
        }, 0);

        const openingBalance = parseFloat(contact.openingDr || 0) - parseFloat(contact.openingCr || 0);
        const calculatedPreviousBalance = openingBalance + prevLedgerRecordsTotal;
        
        setPreviousBalance(calculatedPreviousBalance);

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
      ReactDOM.render(
        <PrintableInvoice invoiceData={invoiceData} />,
        printWindow.document.getElementById("print-root"),
        () => {
          printWindow.focus();
          setTimeout(() => printWindow.print(), 1000);
        }
      );
    };

    if (printWindow.React && printWindow.ReactDOM) {
      renderAndPrint();
    } else {
      printWindow.onload = renderAndPrint;
    }
  };

  const calculateTotals = () => {
    return ledgerEntries.reduce((totals, entry) => {
      const amount = parseFloat(entry.amount || 0);
      if (entry.type === "dr") {
        totals.totalDebit += amount;
      } else if (entry.type === "cr") {
        totals.totalCredit += amount;
      }
      return totals;
    }, { totalDebit: 0, totalCredit: 0 });
  };

  const { totalDebit, totalCredit } = calculateTotals();

  return (
    <div className="p-8 max-w-[1000px] mx-auto border border-gray-300 rounded-lg shadow-lg mt-10">
      <h2 className="text-2xl ml-4 font-bold text-center underline">Oil Kohlu</h2>
      <h4 className="text-2xl font-bold my-4 underline text-right">Account Ledger</h4>
      <p className="text-right underline">
        <b>From: </b> {dateFrom} <b>To: </b> {dateTo}
      </p>
      <p className="text-right underline">
        <b>Current Date and Time:</b> {new Date().toLocaleDateString()}{" "}
        {new Date().toLocaleTimeString()}
      </p>
      <p className="underline">
        <b>Account Name:</b> {accountName || "N/A"}
      </p>

      <table className="table-auto w-full mt-5">
        <thead>
          <tr>
            <th className="border bg-gray-300 px-2 py-2">#</th>
            <th className="border bg-gray-300 px-2 py-2">Date</th>
            <th className="border bg-gray-300 px-2 py-1">Bill</th>
            <th className="border bg-gray-300 px-2 py-2">Entry</th>
            <th className="border bg-gray-300 py-2">Description</th>
            <th className="border bg-gray-300 px-2 py-2">Banam</th>
            <th className="border bg-gray-300 px-2 py-2">Jama</th>
            <th colSpan="2" className="border bg-gray-300 py-2">Remaining</th>
          </tr>
          <tr>
            <th className="border px-2 py-2 text-right underline" colSpan={6}>Previous</th>
            <th className="border px-2 py-2" colSpan={2}>{previousBalance.toFixed(2)}</th>
          </tr>
        </thead>
        <tbody>
          {ledgerEntries.map((entry, index) => {
            const amount = parseFloat(entry.amount || 0);
            if (entry.type === "dr") {
              runningBalance += amount;
            } else if (entry.type === "cr") {
              runningBalance -= amount;
            }

            return (
              <tr key={entry._id}>
                <td className="border px-2 py-2">{index + 1}</td>
                <td className="border px-1 py-2">
                  {new Date(entry.date).toLocaleDateString()}
                </td>
                <td
                  className="border px-2 py-1"
                  style={entry.saleInvoice || entry.purchaseInvoice ? { cursor: "pointer" } : null}
                  onClick={() => {
                    if (entry.saleInvoice) {
                      openPrintableInvoice(entry.saleInvoice);
                    }
                    if (entry.purchaseInvoice) {
                      openPrintableInvoice(entry.purchaseInvoice);
                    }
                  }}
                >
                  {entry.billNo || entry.invoiceNumber || "N/A"}
                </td>
                <td className="border px-2 py-2">
                  {entry.type === "dr" ? "Banam" : "Jama"}
                </td>
                <td className="border px-2 py-1" style={{ whiteSpace: "nowrap", fontSize: "12px" }}>
                  {!entry.saleInvoice && !entry.purchaseInvoice && entry.description}
                  {entry.saleInvoice && (
                    <div style={{ fontSize: "10px" }}>
                      {
                        entry.saleInvoice.items.map((item, index) => (
                          <div key={index}>
                           {item.description && (item.description + ", ")} {item.quantity}, {item.total}
                          </div>
                        ))
                      }
                    </div>
                  )}
                  {entry.purchaseInvoice && (
                    <div style={{ fontSize: "10px" }}>
                      {
                        entry.purchaseInvoice.items.map((item, index) => (
                          <div key={index}>
                           {item.description && (item.description + ", ")} {item.quantity}, {item.total}
                          </div>
                        ))
                      }
                    </div>
                  )}
                </td>
                <td className="border px-2 py-2">
                  {entry.type === "dr" ? amount.toFixed(2) : "0.00"}
                </td>
                <td className="border px-2 py-2">
                  {entry.type === "cr" ? amount.toFixed(2) : "0.00"}
                </td>
                <td className="border px-2 py-2">{runningBalance.toFixed(2)}</td>
                <td className="border px-2 py-2">
                  {runningBalance > 0 ? "Banam" : "Jama"}
                </td>
              </tr>
            );
          })}

          <tr className="bg-gray-300">
            <td colSpan={5} className="border px-2 py-2 font-bold text-right underline">Total</td>
            <td className="border px-2 py-2 font-bold">{totalDebit.toFixed(2)}</td>
            <td className="border px-2 py-2 font-bold">{totalCredit.toFixed(2)}</td>
            <td className="border px-2 py-2 font-bold" colSpan={2}>{runningBalance.toFixed(2)}</td>
          </tr>
          <tr>
            <td colSpan={8} className="border bg-gray-300 px-2 py-2 font-bold underline">
              Current Balance
            </td>
            <td className="border bg-gray-300 px-2 py-2 font-bold">
              {runningBalance.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export { Ledger, LedgerResults };