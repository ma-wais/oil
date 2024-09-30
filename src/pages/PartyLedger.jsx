import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../App";
import Select from "react-select";
import { useNavigate, useLocation } from "react-router-dom";
import PrintableInvoice from "./PrintInvoice";
import ReactDOM from "react-dom";

const PartyLedger = () => {
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
      const response = await axios.get(`${server}/contact?type=${"party"}`);
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handlePartyChange = (selectedOption) => {
    setName(selectedOption.value);
    setSelectedOption(selectedOption);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!dateFrom || !dateTo || !name) {
      alert("Please select all date fields");
      return;
    }
    navigate("/party-ledger-results", {
      state: { dateFrom, dateTo, partyName: name },
    });
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">{"Party Ledger"}</h2>
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
            Party Name
          </label>
          <Select
            options={contacts.map((c) => ({
              value: c.name,
              label: `${c.name} (Balance: ${c.openingDr})`,
            }))}
            onChange={handlePartyChange}
            value={selectedOption}
            className="w-[400px]"
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </form>
    </div>
  );
};

const PartyLedgerResults = () => {
  const [saleData, setSaleData] = useState([]);
  const [ledgerRecords, setLedgerRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previousBalance, setPreviousBalance] = useState(0);
  const { state } = useLocation();
  const { dateFrom, dateTo, partyName } = state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          saleResponse,
          ledgerResponse,
          prevSaleResponse,
          prevLedgerResponse,
        ] = await Promise.all([
          axios.get(`${server}/ledger`, {
            params: { dateFrom, dateTo, customerName: partyName },
          }),
          axios.get(`${server}/ledgerrecords`, {
            params: { dateFrom, dateTo, customerName: partyName },
          }),
          axios.get(`${server}/sale`, {
            params: { dateTo: dateFrom, customerName: partyName },
          }),
          axios.get(`${server}/ledgerrecords`, {
            params: { dateTo: dateFrom, customerName: partyName },
          }),
        ]);

        const sales = saleResponse.data;
        console.log(sales);
        const ledgers = ledgerResponse.data;
        const prevSales = prevSaleResponse.data;
        const prevLedgers = prevLedgerResponse.data;

        setSaleData(sales);
        setLedgerRecords(ledgers);

        const previousSalesTotal = prevSales.reduce(
          (sum, sale) => sum + (sale.grandTotal || 0),
          0
        );
        const previousLedgersTotal = prevLedgers.reduce(
          (sum, record) => sum + (record.amount || 0),
          0
        );
        const calculatedPreviousBalance =
          previousSalesTotal - previousLedgersTotal;

        setPreviousBalance(calculatedPreviousBalance);

        console.log("Previous Sales Total:", previousSalesTotal);
        console.log("Previous Ledgers Total:", previousLedgersTotal);
        console.log("Calculated Previous Balance:", calculatedPreviousBalance);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateFrom, dateTo, partyName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  const allEntries = [...saleData, ...ledgerRecords].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  let runningBalance = previousBalance;

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
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between">
        <h2 className="text-2xl my-4">Company Name</h2>
        <h4 className="text-2xl font-bold my-4">Party Ledger</h4>
      </div>
      <p className="ml-[60%] text-right">
        <b>From</b> {dateFrom} <b>to</b> {dateTo}
      </p>
      <p className="ml-[60%] text-right">
        <b>Current Date and Time:</b> {new Date().toLocaleDateString()}{" "}
        {new Date().toLocaleTimeString()} <br />
      </p>
      <p>
        <b>Party Name:</b> {partyName || "N/A"}
      </p>

      <table className="table-auto w-full mt-5">
        <thead>
          <tr>
            <th className="border bg-slate-200 px-4 py-2">#</th>
            <th className="border bg-slate-200 px-4 py-2">Date</th>
            <th className="border bg-slate-200 px-4 py-2">Bill No</th>
            <th className="border bg-slate-200 px-4 py-2">Entry</th>
            <th className="border bg-slate-200 px-4 py-2">Description</th>
            <th className="border bg-slate-200 px-4 py-2">Jama</th>
            <th className="border bg-slate-200 px-4 py-2">Banam</th>
            <th colSpan={2} className="border bg-slate-200 px-4 py-2">
              Remaining
            </th>
          </tr>
          <tr>
            <th className="border px-4 py-2 text-right" colSpan={6}>
              Previous
            </th>
            <th className="border px-4 py-2" colSpan={2}>
              {previousBalance}
            </th>
          </tr>
        </thead>
        <tbody>
          {allEntries.map((entry, index) => {
            const isSale = "grandTotal" in entry;
            const amount = isSale ? entry.grandTotal : -entry.amount;
            runningBalance += amount;

            return (
              <tr key={entry._id}>
                <td className="border px-4 py-2">{index + 1}</td>
                <td className="border px-4 py-2">
                  {new Date(entry.date).toLocaleDateString()}
                </td>
                <td
                  className="border px-4 py-2"
                  onClick={() => {isSale ? openPrintableInvoice(entry) : ""}}
                >
                  {entry.invoiceNumber}
                </td>
                <td className="border px-4 py-2">
                  {isSale ? "Jama" : "Banam Bill"}
                </td>
                <td className="border px-4 py-2">
                  {entry.items &&
                    entry.items.map((item, index) => (
                      <span key={index}>
                        {item.description}&nbsp;&nbsp;
                        {item.quantity}&nbsp;&nbsp;
                        {item.weight}&nbsp;{item.rate}@&nbsp; {item.total}
                        {index < entry.items.length - 1 ? ", " : ""}
                      </span>
                    ))}
                </td>
                <td className="border px-4 py-2">
                  {isSale ? entry.grandTotal.toFixed(2) : "0.00"}
                </td>
                <td className="border px-4 py-2">
                  {!isSale ? entry.amount.toFixed(2) : "0.00"}
                </td>
                <td className="border px-4 py-2">
                  {runningBalance.toFixed(2)}
                </td>
                <td className="border px-2 py-2">
                  {runningBalance.toFixed(2) > 0 ? "Jama" : "Banam"}
                </td>
              </tr>
            );
          })}

          <tr className="border px-4 py-2 font-bold text-right" colSpan={9}>
            {" "}
          </tr>
          <tr>
            <td className="border px-4 py-2 font-bold text-right" colSpan={5}>
              Total
            </td>
            <td className="border px-4 py-2 font-bold">
              {saleData.reduce((sum, sale) => sum + (sale.grandTotal || 0), 0)}
            </td>
            <td className="border px-4 py-2 font-bold">
              {ledgerRecords.reduce(
                (sum, record) => sum + (record.amount || 0),
                0
              )}
            </td>
          </tr>
          <tr colspan={9}></tr>
          <tr>
            <td colspan={8} className="border bg-slate-200 px-4 py-2 font-bold">
              Current Balance
            </td>
            <td rowSpan={1} className="border bg-slate-200 px-4 py-2 font-bold">
              {runningBalance.toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export { PartyLedger, PartyLedgerResults };
