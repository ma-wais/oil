import { useState } from "react";

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({
    billNo: "",
    partyBillNo: "",
    party: "",
    product: "",
    weight: "",
    rate: "",
    netWeight: "",
    purchaseExpense: "",
    wages: "",
    bardana: "",
    fare: ""
  });

  const addProduct = () => {
    setProducts([...products, productDetails]);
    setProductDetails({
      billNo: "",
      partyBillNo: "",
      party: "",
      product: "",
      weight: "",
      rate: "",
      netWeight: "",
      purchaseExpense: "",
      wages: "",
      bardana: "",
      fare: ""
    });
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md rtl">
      <h2 className="text-xl font-semibold mb-4 text-right">Product Purchase (Urdu)</h2>
      <table className="w-full table-auto mb-4 text-right">
        <thead>
          <tr>
            <th className="border px-4 py-2">Bill No</th>
            <th className="border px-4 py-2">Party Bill No</th>
            <th className="border px-4 py-2">Party</th>
            <th className="border px-4 py-2">Product</th>
            <th className="border px-4 py-2">Weight</th>
            <th className="border px-4 py-2">Rate</th>
            <th className="border px-4 py-2">Net Weight</th>
            <th className="border px-4 py-2">Purchase Expense</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{product.billNo}</td>
              <td className="border px-4 py-2">{product.partyBillNo}</td>
              <td className="border px-4 py-2">{product.party}</td>
              <td className="border px-4 py-2">{product.product}</td>
              <td className="border px-4 py-2">{product.weight}</td>
              <td className="border px-4 py-2">{product.rate}</td>
              <td className="border px-4 py-2">{product.netWeight}</td>
              <td className="border px-4 py-2">{product.purchaseExpense}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-2 gap-4 mb-4 text-right">
        {[
          "Bill No",
          "Party Bill No",
          "Party",
          "Product",
          "Weight",
          "Rate",
          "Net Weight",
          "Purchase Expense",
          "Wages",
          "Bardana",
          "Fare"
        ].map((label, index) => (
          <div key={index}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {label}
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md text-right"
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

      <button
        onClick={addProduct}
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
      >
        Add
      </button>
    </div>
  );
}

export default ProductTable;
