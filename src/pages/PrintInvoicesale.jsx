import React from "react";

const PrintableInvoice = ({ invoiceData }) => {
  console.log("Received invoiceData in PrintableInvoice:", invoiceData);

  if (!invoiceData) {
    console.error("No invoice data received");
    return <div>Error: No invoice data available</div>;
  }

  if (!invoiceData.items || !Array.isArray(invoiceData.items)) {
    console.error("Invalid or missing items in invoice data");
    return <div>Error: Invalid invoice data structure</div>;
  }

  return (
    <div className="w-[210mm] min-h-[297mm] p-8 bg-white text-black mx-auto">
      <div className="text-2xl font-bold mb-4">Invoice</div>
      <div className="flex justify-between mb-6 w-full">
        <div className="w-full">
          <div className="flex justify-between mb-10 w-full">
            <p>
              <span className="font-semibold">Invoice No:</span>{" "}
              {invoiceData.billNo || 'N/A'}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(invoiceData.date).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Party Name:</span>{" "}
              {invoiceData.partyName || 'N/A'}
            </p>
          </div>
          <table className="w-full mb-6">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="text-left py-2">Description</th>
                <th className="text-right py-2">Quantity</th>
                <th className="text-right py-2">Unit</th>
                <th className="text-right py-2">Rate</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {invoiceData.items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2">{item.description || 'N/A'}</td>
                  <td className="text-right py-2">{item.quantity || 'N/A'}</td>
                  <td className="text-right py-2">{item.weight || 'N/A'}</td>
                  <td className="text-right py-2">{item.rate || 'N/A'}</td>
                  <td className="text-right py-2">{item.total || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="w-1/2">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Total:</span>
            <span>{invoiceData.totalAmount || 'N/A'}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Previous Balance:</span>
            <span>{invoiceData.previousBalance || 'N/A'}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Grand Total:</span>
            <span>{invoiceData.grandTotal || 'N/A'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableInvoice;