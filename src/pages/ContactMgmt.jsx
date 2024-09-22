import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { server } from '../App';

const ContactManagement = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedContact, setSelectedContact] = useState(null);
  const [type, setType] = useState('');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (type) {
      fetchContacts();
    }
  }, [type]);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${server}/contact?type=${type}`);
      setContacts(response.data);
      console.log(contacts)
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${server}/contact`, { name, type });
      setName('');
      setShowAddForm(false);
      fetchContacts();
    } catch (error) {
      console.error('Error creating contact:', error);
    }
  };

  const handleUpdateBalance = async () => {
    if (!selectedContact) return;
    try {
      await axios.put(`${server}/balance`, {
        name: selectedContact.value,
        amount: parseFloat(amount),
      });
      setAmount(0);
      fetchContacts();
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Contact Management</h1>
      
      {!type && (
        <div className="mb-4">
          <h2 className="text-xl mb-2">Select Stakeholder Type:</h2>
          <button
            onClick={() => setType('customer')}
            className="bg-blue-500 text-white p-2 rounded mr-2"
          >
            Customer
          </button>
          <button
            onClick={() => setType('party')}
            className="bg-green-500 text-white p-2 rounded w-20"
          >
            Party
          </button>
        </div>
      )}

      {type && (
        <>
          <h2 className="text-xl mb-4">{type === 'customer' ? 'Customers' : 'Parties'}</h2>
          
          <div className="mb-4">
            <Select
              options={contacts.map(c => ({ value: c.name, label: c.name }))}
              onChange={setSelectedContact}
              placeholder={`Select ${type}`}
              className='w-[400px]'
            />
          </div>

          {selectedContact && (
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Contact Details:</h3>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 p-2">Name</th>
                    <th className="border border-gray-300 p-2">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 p-2">{selectedContact.label}</td>
                    <td className="border border-gray-300 p-2">
                      {contacts.find(c => c.name === selectedContact.value)?.openingCr || 0}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Update Balance:</h3>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Amount (positive to increase, negative to decrease)"
                  className="border p-2 rounded mr-2 w-[400px]"
                />
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
                Add New {type === 'customer' ? 'Customer' : 'Party'}
              </button>
            ) : (
              <form onSubmit={handleSubmit} className="mb-4">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={`New ${type} name`}
                  className="border p-2 rounded mr-2"
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded mr-2">
                  Add {type}
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
        </>
      )}

      <button
        onClick={() => {
          setType('');
          setSelectedContact(null);
          setShowAddForm(false);
        }}
        className="mt-4 bg-gray-500 text-white p-2 rounded"
      >
        Back to Type Selection
      </button>
    </div>
  );
};

export default ContactManagement;