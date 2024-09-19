import React, { useState } from "react";
import axios from "axios";
import { server } from "../App";

const CreateCrushing = () => {
  const [date, setDate] = useState("");
  const [seedName, setSeedName] = useState("");
  const [crushingAmount, setCrushingAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!seedName || !crushingAmount || !date) return setMessage("Please fill all fields");
    try {
      const response = await axios.post(`${server}/crushings`, {
        date,
        seedName,
        crushingAmount,
      });
      setMessage("Crushing recorded successfully");
    } catch (error) {
      setMessage(error.response?.data?.message || "Error recording crushing");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-6 p-4 border border-gray-200 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Record Crushing</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Seed Name</label>
          <select
            value={seedName}
            onChange={(e) => setSeedName(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
          >
            <option value="">Select seed</option>
            <option value="sarson">Sarson</option>
            <option value="taramira">Taramira</option>
            <option value="banola">Banola</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Crushing Amount (kg)</label>
          <input
            type="number"
            value={crushingAmount}
            onChange={(e) => setCrushingAmount(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter amount in kg"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Submit
        </button>
        {message && <p className="text-red-500 mt-4">{message}</p>}
      </form>
    </div>
  );
};

export default CreateCrushing;
