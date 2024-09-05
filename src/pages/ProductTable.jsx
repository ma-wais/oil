import { useState } from "react";

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({
    billNo: "",
    partyBillNo: "",
    party: "",
    ng: "",
    product: "",
    weight: "",
    cut: "",
    filterWeight: "",
    unit: "",
    rate: "",
    number: "",
    bardana: "",
    wages: "",
    fare: "",
    netAmount: "",
    purchaseExpense: ""
  });

  const addProduct = () => {
    setProducts([...products, productDetails]);
    setProductDetails({
      billNo: "",
      partyBillNo: "",
      party: "",
      ng: "",
      product: "",
      weight: "",
      cut: "",
      filterWeight: "",
      unit: "",
      rate: "",
      number: "",
      bardana: "",
      wages: "",
      fare: "",
      netAmount: "",
      purchaseExpense: ""
    });
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md rtl">
      {/* First Row: Other History, Bill No, Party Bill No, Party */}
      <div className="grid grid-cols-4 gap-4 mb-4 text-right">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Other History</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={productDetails.otherHistory}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                otherHistory: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bill No</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={productDetails.billNo}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                billNo: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Party Bill No</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={productDetails.partyBillNo}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                partyBillNo: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Party</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={productDetails.party}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                party: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* Table: Inputs to add items (Ng, Product, Weight, etc.) */}
      <table className="w-full table-auto mb-4 text-right">
        <thead>
          <tr>
            <th className="border px-4 py-2">Ng</th>
            <th className="border px-4 py-2">Product</th>
            <th className="border px-4 py-2">Weight</th>
            <th className="border px-4 py-2">Cut</th>
            <th className="border px-4 py-2">Filter Weight</th>
            <th className="border px-4 py-2">Unit</th>
            <th className="border px-4 py-2">Rate</th>
            <th className="border px-4 py-2">Number</th>
            <th className="border px-4 py-2">Bardana</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{product.ng}</td>
              <td className="border px-4 py-2">{product.product}</td>
              <td className="border px-4 py-2">{product.weight}</td>
              <td className="border px-4 py-2">{product.cut}</td>
              <td className="border px-4 py-2">{product.filterWeight}</td>
              <td className="border px-4 py-2">{product.unit}</td>
              <td className="border px-4 py-2">{product.rate}</td>
              <td className="border px-4 py-2">{product.number}</td>
              <td className="border px-4 py-2">{product.bardana}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Inputs for the table data */}
      <div className="grid grid-cols-9 gap-4 mb-4 text-right">
        {[
          "Ng",
          "Product",
          "Weight",
          "Cut",
          "Filter Weight",
          "Unit",
          "Rate",
          "Number",
          "Bardana"
        ].map((label, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md"
              value={productDetails[label.toLowerCase().replace(" ", "")]}
              onChange={(e) =>
                setProductDetails({
                  ...productDetails,
                  [label.toLowerCase().replace(" ", "")]: e.target.value,
                })
              }
            />
          </div>
        ))}
      </div>

      {/* Wages, Bardana, Fare, Net Amount, Purchase Expense */}
      <div className="grid grid-cols-2 gap-4 mb-4 text-right">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Wages</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={productDetails.wages}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                wages: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bardana</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={productDetails.bardana}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                bardana: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fare</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={productDetails.fare}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                fare: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Net Amount</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={productDetails.netAmount}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                netAmount: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Expense</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={productDetails.purchaseExpense}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                purchaseExpense: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* Add Product Button */}
      <button
        onClick={addProduct}
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
      >
        Add Product
      </button>
    </div>
  );
}

export default ProductTable;
