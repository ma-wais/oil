import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../App";
import Select from "react-select";
import { useNavigate, useLocation } from "react-router-dom";

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
    navigate("/party-ledger-results", { state: { dateFrom, dateTo, partyName: name } });
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
  const [purchaseData, setPurchaseData] = useState([]);
  const [ledgerRecords, setLedgerRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { state } = useLocation();
  const { dateFrom, dateTo, partyName } = state || {};

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [purchaseResponse, ledgerResponse] = await Promise.all([
          axios.get(`${server}/purchase`, {
            params: { dateFrom, dateTo, partyName },
          }),
          axios.get(`${server}/ledger`, {
            params: { dateFrom, dateTo, customerName: partyName },
          }),
        ]);

        setPurchaseData(purchaseResponse.data);
        setLedgerRecords(ledgerResponse.data);
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

  const purchaseTotal = purchaseData.reduce((sum, purchase) => sum + (purchase.grandTotal || 0), 0);
  const ledgerTotal = ledgerRecords.reduce((sum, record) => sum + (record.grandTotal || 0), 0);
  const grandTotal = purchaseTotal + ledgerTotal;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Party Ledger Results</h2>
      
      <h3 className="text-xl font-semibold mt-6 mb-2">Purchase Invoices</h3>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Invoice Number</th>
            <th className="px-4 py-2">Party Name</th>
            <th className="px-4 py-2">Total Amount</th>
            <th className="px-4 py-2">Grand Total</th>
          </tr>
        </thead>
        <tbody>
          {purchaseData.map((purchase) => (
            <tr key={purchase._id}>
              <td className="border px-4 py-2">{new Date(purchase.date).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{purchase.invoiceNumber}</td>
              <td className="border px-4 py-2">{purchase.partyName}</td>
              <td className="border px-4 py-2">{purchase.totalAmount}</td>
              <td className="border px-4 py-2">{purchase.grandTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-xl font-semibold mt-6 mb-2">Ledger Records</h3>
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Bill No</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Total Amount</th>
            <th className="px-4 py-2">Grand Total</th>
          </tr>
        </thead>
        <tbody>
          {ledgerRecords.map((record) => (
            <tr key={record._id}>
              <td className="border px-4 py-2">{new Date(record.date).toLocaleDateString()}</td>
              <td className="border px-4 py-2">{record.invoiceNumber}</td>
              <td className="border px-4 py-2">{record.partyName}</td>
              <td className="border px-4 py-2">{record.totalAmount}</td>
              <td className="border px-4 py-2">{record.grandTotal}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-6">
        <p className="font-bold">Total Purchases: {purchaseTotal}</p>
        <p className="font-bold">Total Ledger: {ledgerTotal}</p>
        <p className="font-bold text-xl">Grand Total: {grandTotal}</p>
      </div>
    </div>
  );
};

export { PartyLedger, PartyLedgerResults };