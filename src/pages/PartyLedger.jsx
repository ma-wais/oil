import React, { useState, useEffect } from "react";
import axios from "axios";
import { server } from "../App";
import Select from "react-select";

const PartyLedger = () => {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [name, setName] = useState("");
  const [ledgerData, setLedgerData] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

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

  const fetchLedgerData = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`${server}/ledger`, {
        params: {
          dateFrom,
          dateTo,
          partyName: name,
        },
      });
      console.log(response.data);

      setLedgerData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching ledger data", error);
      setLedgerData([]);
    }
  };

  const handleCustomerChange = (selectedOption) => {
    const selectedContact = contacts.find(
      (c) => c.name === selectedOption.value
    );
    setName(selectedOption.value);
    setSelectedOption(selectedOption);
  };

  const grandTotalSum = ledgerData.reduce(
    (sum, record) => sum + (record.grandTotal || 0),
    0
  );

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
            Psrty Name
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
          onClick={fetchLedgerData}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Search
        </button>
      </form>

      <table className="table-auto w-full mt-8">
        <thead>
          <tr>
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Bill.No</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Total Amount</th>
            <th className="px-4 py-2">Grand Total</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(ledgerData) && ledgerData.length > 0 ? (
            ledgerData.map((record) => (
              <tr key={record._id}>
                <td className="border px-4 py-2">
                  {new Date(record.date).toLocaleDateString()}
                </td>
                <td className="border px-4 py-2">{record.invoiceNumber}</td>
                <td className="border px-4 py-2">{record.partyName}</td>
                <td className="border px-4 py-2">{record.totalAmount}</td>
                <td className="border px-4 py-2">{record.grandTotal}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No records found
              </td>
            </tr>
          )}
        </tbody>
        {ledgerData.length > 0 && (
          <tfoot>
            <tr className="font-bold">
              <td colSpan="4" className="text-right px-4 py-2">
                Total Grand Total:
              </td>
              <td className="border px-4 py-2">{grandTotalSum}</td>
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
};

export default PartyLedger;
