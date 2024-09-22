import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { server } from "../App";

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({
    description: "",
    quantity: "",
    Unit: "mans",
    rate: "",
    total: "",
  });
  const [selectedOption, setSelectedOption] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState({
    billNo: "",
    date: "",
    customerName: "",
    previousBalance: 0,
  });
  const [netAmount, setNetAmount] = useState(0);
  const [receivedCash, setReceivedCash] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [contacts, setContacts] = useState([]);

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
    setGrandTotal(
      Number(newGrandTotal) + Number(invoiceDetails.previousBalance)
    );
  }, [products, invoiceDetails.previousBalance, receivedCash]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${server}/contact?type=${"customer"}`);
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };
  const addProduct = () => {
    const newProduct = {
      ...productDetails,
      id: Date.now(),
    };
    setProducts([...products, newProduct]);
    setProductDetails({
      description: "",
      quantity: "",
      Unit: "",
      rate: "",
      total: "",
    });
    setSelectedOption(null);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((product) => product.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...invoiceDetails,
      products,
      netAmount,
      receivedCash,
      grandTotal,
    };
    console.log(data);
    try {
      const response = await axios.post(`${server}/sales`, data);
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

  const handleCustomerChange = (selectedOption) => {
    const selectedContact = contacts.find(
      (c) => c.name === selectedOption.value
    );
    setInvoiceDetails({
      ...invoiceDetails,
      customerName: selectedOption.value,
      previousBalance: selectedContact ? selectedContact.openingCr : 0,
    });
    setSelectedOption(selectedOption);
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
          <Select
            options={contacts.map((c) => ({
              value: c.name,
              label: `${c.name} (Balance: ${c.openingCr})`,
            }))}
            onChange={handleCustomerChange}
            value={selectedOption}
            className="w-[400px]"
          />
        </div>
      </div>

      <table className="w-full table-auto my-10 text-right">
        <thead>
          <tr>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Unit</th>
            <th className="border px-4 py-2">Rate</th>
            <th className="border px-4 py-2">Total</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product.id}>
              <td className="border px-4 py-2">{product.description}</td>
              <td className="border px-4 py-2">{product.quantity}</td>
              <td className="border px-4 py-2">{product.Unit}</td>
              <td className="border px-4 py-2">{product.rate}</td>
              <td className="border px-4 py-2">{product.total}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => deleteProduct(product.id)}
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
        {["Description", "Quantity", "Unit", "Rate", "Total"].map((label) => {
          const key = `input-${label}`;

          return label === "Unit" ? (
            <div key={key}>
              <select
                className="w-full mt-7 p-2 border border-gray-300 rounded-md"
                value={productDetails.Unit}
                onChange={(e) =>
                  setProductDetails({
                    ...productDetails,
                    [label.replace(" ", "")]: e.target.value,
                  })
                }
              >
                {/* <option value="">Unit</option> */}
                {/* <option value="kg">KG</option> */}
                <option value="mans">Mans</option>
                {/* <option value="piece">Piece</option> */}
              </select>
            </div>
          ) : (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {label}
              </label>
              <input
                type={label === "Description" ? "text" : "number"}
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
          );
        })}
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
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Wasool
          </label>
          <input
            type="number"
            min={0}
            className="w-full p-2 border border-gray-300 rounded-md"
            onChange={(e) => setReceivedCash(e.target.value)}
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
