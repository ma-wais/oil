import React, { useEffect, useState } from "react";
import axios from "axios";
import { server } from "../App";
import Select from "react-select";

const StockHistory = () => {
  const [stockUpdates, setStockUpdates] = useState([]);
  const [productName, setProductName] = useState("");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchStockUpdates();
    fetchProducts();
  }, [productName]);

  const fetchStockUpdates = async () => {
    try {
      const response = await axios.get(`${server}/stock-updates`, {
        params: productName ? { productName } : {},
      });
      setStockUpdates(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching stock updates:", error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${server}/products`);
      setProducts(
        response.data.map((product) => ({
          value: product.name,
          label: product.name,
        }))
      );
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-6 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Stock Update History</h2>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2">Filter by Product</label>
        <Select
          options={products}
          onChange={(selected) => setProductName(selected?.value || "")}
          value={products.find((p) => p.value === productName)}
          isClearable
          className="w-full"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Product Name</th>
              <th className="py-3 px-6 text-left">Stock Added (mans)</th>
              <th className="py-3 px-6 text-left">Party Name</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-left">Total Stock Left</th>
            </tr>
          </thead>
          <tbody className="text-gray-700 text-sm">
            {stockUpdates.map((update) => (
              <tr key={update._id} className="border-b border-gray-300">
                <td className="py-3 px-6">{update.productName}</td>
                <td className="py-3 px-6">{update.stockInKg}</td>
                <td className="py-3 px-6">{update.partyName}</td>
                <td className="py-3 px-6">
                  {new Date(update.date).toLocaleDateString()}
                </td>
                <td className="py-3 px-6">{update.totalLeft}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockHistory;
