import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { server } from "../App";
import PrintableInvoice from "./PrintInvoicesale";
import ReactDOM from "react-dom";

function ProductTable() {
  const [products, setProducts] = useState([]);
  const [productDetails, setProductDetails] = useState({
    description: "",
    quantity: 0,
    Unit: "",
    rate: 0,
    total: 0,
  });
  const [selectedOption, setSelectedOption] = useState(null);
  const [invoiceDetails, setInvoiceDetails] = useState({
    billNo: 0,
    date: "",
    customerName: "",
    carNo: "",
    carRent: 0,
    gojarkhanWeight: 0,
    receivedWeight: 0,
    nag: 0,
    previousBalance: 0,
  });
  const [netAmount, setNetAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [showPrintableInvoice, setShowPrintableInvoice] = useState(false);

  useEffect(() => {
    fetchContacts();
    fetchCurrentBillNo();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(`${server}/contact`);
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchCurrentBillNo = async () => {
    try {
      const response = await axios.get(`${server}/purchase/currentBillNo`);
      setInvoiceDetails((prevDetails) => ({
        ...prevDetails,
        billNo: response.data.currentBillNo,
      }));
    } catch (error) {
      console.error("Error fetching current bill number:", error);
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

    setNetAmount(productsTotal.toFixed(2));
    setGrandTotal(productsTotal + Number(invoiceDetails.previousBalance));
  }, [products, invoiceDetails, invoiceDetails.previousBalance]);

  const addProduct = () => {
    const productWithDefaults = {
      ...productDetails,
      rate: productDetails.rate || 0, 
      quantity: productDetails.quantity || 0,
    };
    setProducts([...products, productWithDefaults]);
  
    setProductDetails({
      description: "",
      quantity: 0,
      Unit: "",
      rate: 0,
      total: 0,
    });
  };

  const deleteProduct = (indexToDelete) => {
    setProducts(products.filter((_, index) => index !== indexToDelete));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!invoiceDetails.date) {
      alert("Please enter date");
      return;
    }
    const nextBillResponse = await axios.get(`${server}/purchase/nextBillNo`);
    const nextBillNo = nextBillResponse.data.nextBillNo;
    setInvoiceDetails((prevDetails) => ({
      ...prevDetails,
      billNo: nextBillNo,
    }));
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
      openPrintableInvoice(data);
      setInvoiceDetails({
        billNo: "",
        date: "",
        customerName: "",
        carNo: "",
        carRent: 0,
        gojarkhanWeight: 0,
        receivedWeight: 0,
        nag: 0,
        previousBalance: 0,
      });
      setProducts([
        {
          description: "",
          quantity: 0,
          Unit: "",
          rate: 0,
          total: 0,
        }
      ]);
      fetchCurrentBillNo();
      setShowPrintableInvoice(true);
    } catch (error) {
      console.error(error);
      alert("Invoice created but failed to print");
    }
  };

  const openPrintableInvoice = (invoiceData) => {
    console.log("Invoice data being passed to PrintableInvoice:", invoiceData);

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print Invoice</title>
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body>
          <div id="print-root"></div>
          <script src="https://unpkg.com/react@17/umd/react.development.js"></script>
          <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"></script>
        </body>
      </html>
    `);
    printWindow.document.close();

    const renderAndPrint = () => {
      try {
        ReactDOM.render(
          <PrintableInvoice invoiceData={invoiceData} />,
          printWindow.document.getElementById("print-root"),
          () => {
            console.log("PrintableInvoice rendered in new window");
            printWindow.focus();
            setTimeout(() => {
              console.log("Attempting to print");
              printWindow.print();
            }, 1000);
          }
        );
      } catch (error) {
        console.error("Error rendering PrintableInvoice:", error);
        printWindow.document.body.innerHTML = `<h1>Error rendering invoice: ${error.message}</h1>`;
      }
    };

    if (printWindow.React && printWindow.ReactDOM) {
      renderAndPrint();
    } else {
      printWindow.onload = renderAndPrint;
    }
  };

  const handleCustomerChange = (selectedOption) => {
    const selectedContact = contacts.find(
      (c) => c.name === selectedOption.value
    );
    setInvoiceDetails({
      ...invoiceDetails,
      customerName: selectedOption.value,
      previousBalance: selectedContact ? selectedContact.openingDr : 0,
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
              label: `${c.name} (Balance: ${c.openingDr - c.openingCr})`,
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
                  <option value="">Unit</option>
                  <option value="kg">KG</option>
                  <option value="mans">Mans</option>
                  <option value="piece">Piece</option>
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
                  min={0}
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
            Gujar khan Weight
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

      {showPrintableInvoice && (
        <PrintableInvoice
          invoiceData={{
            ...invoiceDetails,
            products,
            netAmount,
            grandTotal,
          }}
        />
      )}
    </div>
  );
}

export default ProductTable;
