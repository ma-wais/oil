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
  const [balanceType, setBalanceType] = useState("");
  const [billNo, setBillNo] = useState();
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [updatedContact, setUpdatedContact] = useState(null);

  useEffect(() => {
    fetchAllContacts();
    fetchCurrentBillNo();
  }, []);

  const fetchAllContacts = async () => {
    try {
      const customersResponse = await axios.get(
        `${server}/contact`
      );
      // const partiesResponse = await axios.get(`${server}/contact?type=party`);
      setContacts([
        ...customersResponse.data.map((c) => ({ ...c })),
        // ...partiesResponse.data.map((p) => ({ ...p, type: "party" })),
      ]);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${server}/contact`, { name });
      setName("");
      setShowAddForm(false);
      fetchAllContacts();
    } catch (error) {
      console.error("Error creating contact:", error);
    }
  };

  const handleUpdateBalance = async () => {
    if (!selectedContact) return alert("Please select a contact");
    const nextBillResponse = await axios.get(`${server}/purchase/nextBillNo`);
    const nextBillNo = nextBillResponse.data.nextBillNo;
    setBillNo(nextBillNo);
    try {
      await axios.put(`${server}/balance`, {
        name: selectedContact,
        amount: parseFloat(amount),
        billNo,
        date,
        description,
        type: balanceType,
      });
      setAmount(0);
      setDescription("");
      fetchAllContacts();
    } catch (error) {
      console.error("Error updating balance:", error);
    }
  };

  const fetchCurrentBillNo = async () => {
    try {
      const response = await axios.get(`${server}/purchase/currentBillNo`);
      setBillNo(response.data.currentBillNo);
    } catch (error) {
      console.error("Error fetching current bill number:", error);
    }
  };

  const handleEdit = (contact) => {
    setUpdatedContact(contact);
    setName(contact.name);
    setType(contact.type);
  };

  const handleDelete = async (contactId) => {
    try {
      await axios.delete(`${server}/contact/${contactId}`);
      fetchAllContacts();
    } catch (error) {
      console.error("Error deleting contact:", error);
    }
  };

  const handleUpdate = async () => {
    try {
      const updateContact = { name, type };
      await axios.put(`${server}/contact/${updatedContact._id}`, updateContact);
      fetchAllContacts();
      setSelectedContact(null);
    } catch (error) {
      console.error("Error updating contact:", error);
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
            label: `${c.name}`,
          }))}
          onChange={(e) => {
            setSelectedContact(e.value);
          }}
          placeholder="Select contact to update balance"
          className="w-[400px]"
        />
      </div>

      {selectedContact && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Update Balance:</h3>
          <div className="flex gap-2 flex-wrap">
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 rounded mr-2 w-[400px]"
            />
            <input
              type="text"
              placeholder="Bill No"
              value={billNo}
              onChange={(e) => setBillNo(e.target.value)}
              className="border p-2 rounded mr-2 w-[400px]"
            />
            <input
              type="date"
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 rounded mr-2 w-[400px]"
            />
            <select
              name="balanceType"
              id="balanceType"
              className="border p-2 rounded mr-2 w-[400px]"
              onChange={(e) => setBalanceType(e.target.value)}
            >
              <option value="">Select type</option>
              <option value="cr">Jama</option>
              <option value="dr">Banam</option>
            </select>
            <button
              onClick={handleUpdateBalance}
              className="bg-yellow-500 text-white p-2 rounded"
            >
              Update Balance
            </button>
          </div>
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
            {/* <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="border p-2 rounded mr-2"
            >
              <option value="">Select type</option>
              <option value="customer">Customer</option>
              <option value="party">Party</option>
            </select> */}
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

      {updatedContact && (
        <div>
          <h3 className="text-lg font-semibold my-2">Edit Contact</h3>
          <input
            className="border p-2 rounded mr-2"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <select
            className="border p-2 rounded mr-2"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="customer">Customer</option>
            <option value="party">Party</option>
          </select>
          <button
            onClick={handleUpdate}
            className="bg-green-500 text-white p-2 rounded"
          >
            Update Contact
          </button>
        </div>
      )}

      <table className="w-full border-collapse border border-gray-300 my-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Name</th>
            {/* <th className="border border-gray-300 p-2">Type</th> */}
            <th className="border border-gray-300 p-2">Banam</th>
            <th className="border border-gray-300 p-2">Jama</th>
            <th className="border border-gray-300 p-2 w-[200px]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{contact.name}</td>
              {/* <td className="border border-gray-300 p-2 capitalize">
                {contact.type}
              </td> */}
              <td className="border border-gray-300 p-2">
                {contact.openingDr || 0}
              </td>
              <td className="border border-gray-300 p-2">{contact.openingCr || 0}</td>
              <td className="border border-gray-300 p-2">
                <button
                  onClick={() => handleEdit(contact)}
                  className="mr-2 bg-blue-500 text-white p-1 rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(contact._id)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ContactManagement;
