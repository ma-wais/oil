import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { server } from "../App";

const options = [
  { value: "sarson", label: "Sarson" },
  { value: "taramira", label: "Taramira" },
  { value: "banola", label: "Banola" },
];

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({
    description: "",
    quantity: "",
    weight: "Kg",
    rate: "",
    total: "",
  });
  const [selectedOption, setSelectedOption] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState({
    billNo: "",
    date: "",
    customerName: "",
    previousBalance: "",
  });
  const [netAmount, setNetAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    const { quantity, rate } = productDetails;
    const total = (parseFloat(quantity) || 0) * (parseFloat(rate) || 0);
    setProductDetails((prevDetails) => ({
      ...prevDetails,
      total: total.toFixed(2),
    }));
  }, [productDetails.quantity, productDetails.rate]);

  useEffect(() => {
    const productsTotal = products.reduce((acc, product) => {
      return acc + (parseFloat(product.total) || 0);
    }, 0);

    const newGrandTotal = productsTotal;
    setNetAmount(newGrandTotal.toFixed(2));
    setGrandTotal(newGrandTotal + Number(invoiceDetails.previousBalance));
  }, [products, invoiceDetails.previousBalance]);

  const addProduct = () => {
    setProducts([...products, productDetails]);
    setProductDetails({
      description: "",
      quantity: "",
      weight: "Kg",
      rate: "",
      total: "",
    });
    setSelectedOption(null);
  };

  const deleteProduct = (indexToDelete) => {
    setProducts(products.filter((_, index) => index !== indexToDelete));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...invoiceDetails,
      products,
      netAmount,
      grandTotal,
    };
    console.log(data);
    try {
      const response = await axios.post(`${server}/purchase`, data);
      console.log(response.data);
      alert("Invoice created successfully");
      setInvoiceDetails({
        billNo: "",
        date: "",
        customerName: "",
        previousBalance: "",
      });
      setProducts([]);
    } catch (error) {
      console.error(error);
      alert("Error creating invoice");
    }
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
            value={invoiceDetails.billNo}
            onChange={(e) =>
              setInvoiceDetails({
                ...invoiceDetails,
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
            value={invoiceDetails.date}
            onChange={(e) =>
              setInvoiceDetails({
                ...invoiceDetails,
                date: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Customer Name
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={invoiceDetails.customerName}
            onChange={(e) =>
              setInvoiceDetails({
                ...invoiceDetails,
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
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{product.description}</td>
              <td className="border px-4 py-2">{product.quantity}</td>
              <td className="border px-4 py-2">{product.weight}</td>
              <td className="border px-4 py-2">{product.rate}</td>
              <td className="border px-4 py-2">{product.total}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => deleteProduct(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="grid grid-cols-6 gap-4 mb-4 text-right">
        {["Description", "Quantity", "Weight", "Rate", "Total"].map(
          (label, index) =>
            index < 1 ? (
              <Select
                name={label}
                placeholder={label}
                value={selectedOption}
                key={index}
                options={options}
                onChange={(e) => {
                  setSelectedOption(e);
                  setProductDetails({
                    ...productDetails,
                    description: e.value,
                  });
                }}
                className="mt-7"
              />
            ) : (
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label}
                </label>
                <input
                  type={label === "Weight" ? "text" : "number"}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={
                    label === "Weight"
                      ? "Kg"
                      : productDetails[label.toLowerCase().replace(" ", "")]
                  }
                  readOnly={label === "Weight"}
                  onChange={(e) =>
                    setProductDetails({
                      ...productDetails,
                      [label.toLowerCase().replace(" ", "")]: e.target.value,
                    })
                  }
                  disabled={label === "Total"}
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

      <div className="grid grid-cols-5 gap-4 mb-4 text-right">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total
          </label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={netAmount}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Previous Balance
          </label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={invoiceDetails.previousBalance}
            onChange={(e) =>
              setInvoiceDetails({
                ...invoiceDetails,
                previousBalance: e.target.value,
              })
            }
          />
        </div>
        <div className="mt-6 text-right">
          <span className="text-lg font-semibold">Grand Total: </span>
          <span className="text-lg">{grandTotal}</span>
        </div>
        <button
          className="bg-blue-500 text-white rounded-md block w-40 m-4"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default ProductTable;
