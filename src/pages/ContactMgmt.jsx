import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { server } from "../App";

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [type, setType] = useState("");
  const [name, setName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [amount, setAmount] = useState(0);
  const [billNo, setBillNo] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchAllContacts();
  }, []);

  const fetchAllContacts = async () => {
    try {
      const customersResponse = await axios.get(
        `${server}/contact?type=customer`
      );
      const partiesResponse = await axios.get(`${server}/contact?type=party`);
      setContacts([
        ...customersResponse.data.map((c) => ({ ...c, type: "customer" })),
        ...partiesResponse.data.map((p) => ({ ...p, type: "party" })),
      ]);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${server}/contact`, { name, type });
      setName("");
      setShowAddForm(false);
      fetchAllContacts();
    } catch (error) {
      console.error("Error creating contact:", error);
    }
  };

  const handleUpdateBalance = async () => {
    if (!selectedContact) return;
    try {
      await axios.put(`${server}/balance`, {
        name: selectedContact.value,
        amount: parseFloat(amount),
        billNo,
        date,
        description,
      });
      setAmount(0);
      setDescription("");
      setBillNo("");
      setDate("");
      fetchAllContacts();
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contact Management</h1>

      <h2 className="text-xl mb-4">All Contacts and Balances</h2>
      <div className="mb-4">
        <Select
          options={contacts.map((c) => ({
            value: c.name,
            label: `${c.name} (${c.type})`,
          }))}
          onChange={setSelectedContact}
          placeholder="Select contact to update balance"
          className="w-[400px]"
        />
      </div>

      {selectedContact && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Update Balance:</h3>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="border p-2 rounded mr-2 w-[400px]"
          />
          <input
            type="text"
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 rounded mr-2 w-[400px]"
          />
          <input
            type="text"
            placeholder="Bill No"
            onChange={(e) => setBillNo(e.target.value)}
            className="border p-2 rounded mr-2 w-[400px]"
          />
          <input
            type="date"
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 rounded mr-2 w-[400px]"
          />
          <button
            onClick={handleUpdateBalance}
            className="bg-yellow-500 text-white p-2 rounded"
          >
            Update Balance
          </button>
        </div>
      )}

      <div className="mt-4">
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-purple-500 text-white p-2 rounded"
          >
            Add New Contact
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="mb-4">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New contact name"
              className="border p-2 rounded mr-2"
            />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border p-2 rounded mr-2"
            >
              <option value="">Select type</option>
              <option value="customer">Customer</option>
              <option value="party">Party</option>
            </select>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded mr-2"
            >
              Add Contact
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="bg-red-500 text-white p-2 rounded"
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      <table className="w-full border-collapse border border-gray-300 my-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Type</th>
            <th className="border border-gray-300 p-2">Balance</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{contact.name}</td>
              <td className="border border-gray-300 p-2 capitalize">
                {contact.type}
              </td>
              <td className="border border-gray-300 p-2">
                {contact.openingDr || 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactManagement;
