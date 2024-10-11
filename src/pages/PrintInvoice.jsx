import React from "react";

const PrintableInvoicePage = ({ invoiceData }) => {
  const currentDate = new Date();

  return (
    <div className="w-[210mm] min-h-[297mm] p-8 bg-white text-black border m-4 border-gray-300 rounded-lg shadow-lg">
      <div className="text-4xl font-extrabold mb-6 text-center text-gray-800">
        Oil Kohlu
      </div>

      <div className="flex justify-between items-center">
        <p>
          <span className="font-semibold">Invoice No:</span>{" "}
          {invoiceData.billNo}
        </p>
        <p>
          <span className="font-semibold">Date:</span>{" "}
          {invoiceData.date.slice(0, 10)}
        </p>
        <p>
          <span className="font-semibold">Party:</span>{" "}
          {invoiceData.customerName}
        </p>
      </div>
        <p className="my-5"><b>Issued On :</b> {currentDate.toDateString()}</p>
      <div className="mb-10">
        <table className="w-full border-collapse bg-gray-50">
          <thead className="bg-gray-200">
            <tr className="border-b-2 border-gray-300">
              <th className="text-left py-3 px-4 border border-gray-300">Description</th>
              <th className="text-right py-3 px-4 border border-gray-300">Quantity</th>
              <th className="text-right py-3 px-4 border border-gray-300">Unit</th>
              <th className="text-right py-3 px-4 border border-gray-300">Rate</th>
              <th className="text-right py-3 px-4 border border-gray-300">Total</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData?.items.map((product, index) => (
              <tr
                key={index}
                className={`border-black ${
                  index % 2 === 0 ? "bg-gray-100" : "bg-white"
                }`}
              >
                <td className="py-2 px-4 border border-gray-300">{product.description}</td>
                <td className="text-right py-2 px-4 border border-gray-300">{product.quantity}</td>
                <td className="text-right py-2 px-4 border border-gray-300">{product.weight}</td>
                <td className="text-right py-2 px-4 border border-gray-300">{product.rate}</td>
                <td className="text-right py-2 px-4 border border-gray-300">{product.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {invoiceData.details && (
        <div className="border border-gray-300 p-4 rounded-lg bg-gray-50 mb-10">
          <p>
            <span className="font-semibold">Vehicle No:</span>{" "}
            {invoiceData.details.carNo}
          </p>
          <p>
            <span className="font-semibold">Vehicle Fare:</span>{" "}
            {invoiceData.details.carRent}
          </p>
          <p>
            <span className="font-semibold">Previous-Weight:</span>{" "}
            {invoiceData.details.gojarkhanWeight}
          </p>
          <p>
            <span className="font-semibold">New Weight:</span>{" "}
            {invoiceData.details.receivedWeight}
          </p>
          <p>
            <span className="font-semibold">Nag:</span>{" "}
            {invoiceData.details.nag}
          </p>
        </div>
      )}

      <div className="flex justify-end">
        <div className="w-1/2 border-t-2 border-gray-300 pt-4">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Total:</span>
            <span>{invoiceData.totalAmount}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Previous Balance:</span>
            <span>{invoiceData.previousBalance}</span>
          </div>
          {invoiceData.receivedCash && (
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Received:</span>
              <span>{invoiceData.receivedCash}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-lg">
            <span>Grand Total:</span>
            <span>{invoiceData.grandTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableInvoicePage;
