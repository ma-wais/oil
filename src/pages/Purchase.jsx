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
    carNo: "",
    carRent: "",
    gojarkhanWeight: "",
    receivedWeight: "",
    nag: "",
    previousBalance: "",
  });
  const [netAmount, setNetAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${server}/contact?type=${"party"}`);
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

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

    const carRent = parseFloat(invoiceDetails.carRent) || 0;
    const newGrandTotal = productsTotal + carRent;
    setNetAmount(newGrandTotal.toFixed(2));
    setGrandTotal(newGrandTotal + Number(invoiceDetails.previousBalance));
  }, [products, invoiceDetails, invoiceDetails.previousBalance]);

  const addProduct = () => {
    setProducts([...products, productDetails]);
    setProductDetails({
      description: "",
      quantity: "",
      Unit: "mans",
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
        carNo: "",
        carRent: "",
        gojarkhanWeight: "",
        receivedWeight: "",
        nag: "",
        previousBalance: "",
      });
      setProducts([]);
    } catch (error) {
      console.error(error);
      alert("Error creating invoice");
    }
  };

  const handleCustomerChange = (selectedOption) => {
    const selectedContact = contacts.find(c => c.name === selectedOption.value);
    setInvoiceDetails({
      ...invoiceDetails,
      customerName: selectedOption.value,
      previousBalance: selectedContact ? selectedContact.openingDr : 0
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
            Party Name
          </label>
          <Select
            options={contacts.map((c) => ({
              value: c.name,
              label: `${c.name} (Balance: ${c.openingDr})`,
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
            <th className="border px-4 py-2">Product</th>
            <th className="border px-4 py-2">Quantity</th>
            <th className="border px-4 py-2">Unit</th>
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
              <td className="border px-4 py-2">{product.Unit}</td>
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
        {["Description", "Quantity", "Unit", "Rate", "Total"].map(
          (label, index) =>
           index === 2 ? (
              <div>
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
              <div key={index}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {label}
                </label>
                <input
                  type={index === 0 ? "text" : "number"}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  value={productDetails[label.toLowerCase().replace(" ", "")]}
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

      <h1 className="block text-2xl mt-10 font-medium text-gray-700 mb-2">
        Details
      </h1>
      <div className="grid grid-cols-5 gap-4 mb-4 text-right">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle No.
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={invoiceDetails.carNo}
            onChange={(e) =>
              setInvoiceDetails({
                ...invoiceDetails,
                carNo: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Vehicle Fare
          </label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={invoiceDetails.carRent}
            onChange={(e) =>
              setInvoiceDetails({
                ...invoiceDetails,
                carRent: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Previous Weight
          </label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded-md"
            value={invoiceDetails.gojarkhanWeight}
            onChange={(e) =>
              setInvoiceDetails({
                ...invoiceDetails,
                gojarkhanWeight: e.target.value,
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
            value={invoiceDetails.receivedWeight}
            onChange={(e) =>
              setInvoiceDetails({
                ...invoiceDetails,
                receivedWeight: e.target.value,
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
            value={invoiceDetails.nag}
            onChange={(e) =>
              setInvoiceDetails({
                ...invoiceDetails,
                nag: e.target.value,
              })
            }
          />
        </div>
      </div>

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
