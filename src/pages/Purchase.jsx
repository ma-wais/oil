import { useState } from "react";

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({
    billNo: "",
    date: "",
    customerName: "",
    description: "",
    quantity: "",
    weight: "",
    unit: "",
    rate: "",
    total: "",
    wasool: "",
    netAmount: "",
    previousBalance: "",
    grandTotal: "",
  });

  const addProduct = () => {
    setProducts([...products, productDetails]);
    setProductDetails({
      billNo: "",
      date: "",
      customerName: "",
      description: "",
      quantity: "",
      weight: "",
      unit: "",
      rate: "",
      total: "",
      wasool: "",
      netAmount: "",
      previousBalance: "",
      grandTotal: "",
    });
  };

  return (
    <div className="p-6 bg-white shadow-md rounded-md rtl">
      <h2 className="text-xl font-semibold mb-4">Product Sale Table</h2>
      <div className="grid grid-cols-4 gap-4 mb-4 text-right">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Invoice No
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={productDetails.date}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                date: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Party Name
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={productDetails.customerName}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                customerName: e.target.value,
              })
            }
          />
        </div>
      </div>

      <table className="w-full table-auto my-10 text-right">
        <thead>
          <tr>
            <th className="border px-4 py-2">Product</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Weight</th>
            <th className="border px-4 py-2">Rate</th>
            <th className="border px-4 py-2">Total</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{product.product}</td>
              <td className="border px-4 py-2">{product.quantity}</td>
              <td className="border px-4 py-2">{product.weight}</td>
              <td className="border px-4 py-2">{product.rate}</td>
              <td className="border px-4 py-2">{product.total}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-5 gap-4 mb-4 text-right">
        {["Product", "Quantity.", "Weight", "Rate", "Total"].map(
          (label, index) => (
            <div key={index}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
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
          )
        )}
      </div>
      <button
        onClick={addProduct}
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
      >
        Add Product
      </button>

      <h1 className="block text-2xl mt-10 font-medium text-gray-700 mb-2">
        Details
      </h1>
      <div className="grid grid-cols-5 gap-4 mb-4 text-right">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Car No.
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={productDetails.carNo}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                carNo: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Car Fare
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={productDetails.carFare}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                carFare: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Previous Weight
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={productDetails.previousWeight}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                previousWeight: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            New Weight
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={productDetails.newWeight}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                newWeight: e.target.value,
              })
            }
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nag
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={productDetails.nag}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                nag: e.target.value,
              })
            }
          />
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4 mb-4 text-right">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total
          </label>
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Previous Balance
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={productDetails.previousBalance}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                previousBalance: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grand Total
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={productDetails.grandTotal}
            onChange={(e) =>
              setProductDetails({
                ...productDetails,
                grandTotal: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

export default ProductTable;
