import React from "react";

const PrintableInvoice = ({ invoiceData }) => {
  console.log("Received invoiceData in PrintableInvoice:", invoiceData);

  if (!invoiceData) {
    console.error("No invoice data received");
    return <div>Error: No invoice data available</div>;
  }

  if (!invoiceData.products || !Array.isArray(invoiceData.products)) {
    console.error("Invalid or missing items in invoice data");
    return <div>Error: Invalid invoice data structure {invoiceData.items}</div>;
  }

  return (
    <div className="w-[210mm] min-h-[297mm] p-8 bg-white text-black mx-auto">
      <div className="text-2xl font-bold mb-4">Invoice</div>
      <div className="flex justify-between mb-6 w-full">
        <div className="w-full">
          <div className="flex justify-between mb-10 w-full">
            <p>
              <span className="font-semibold">Invoice No:</span>{" "}
              {invoiceData.billNo || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(invoiceData.date).toLocaleDateString()}
            </p>
            <p>
              <span className="font-semibold">Party Name:</span>{" "}
              {invoiceData.customerName || "N/A"}
            </p>
          </div>
          <div className="mb-6 flex justify-between w-full gap-10">
          <table className="w- mb-6">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2" w-40>Description</th>
                  <th className="text-right py-2 w-44">Quantity</th>
                  <th className="text-right py-2 w-44">Unit</th>
                  <th className="text-right py-2 w-44">Rate</th>
                  <th className="text-right py-2 w-44">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.products.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="py-2">{item.description || "N/A"}</td>
                    <td className="text-right py-2">
                      {item.quantity || "N/A"}
                    </td>
                    <td className="text-right py-2">{item.Unit}</td>
                    <td className="text-right py-2">{item.rate || "N/A"}</td>
                    <td className="text-right py-2">{item.total || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {invoiceData.carNo && (
              <div className="flex flex-col gap-4 w-60">
                <p>
                  <span className="font-semibold">Vehicle No:</span>{" "}
                  {invoiceData.carNo}
                </p>
                <p>
                  <span className="font-semibold">Vehicle Fare:</span>{" "}
                  {invoiceData.carRent}
                </p>
                <p>
                  <span className="font-semibold">Previous-Weight:</span>{" "}
                  {invoiceData.gojarkhanWeight}
                </p>
                <p>
                  <span className="font-semibold">New Weight:</span>{" "}
                  {invoiceData.receivedWeight}
                </p>
                <p>
                  <span className="font-semibold">Nag:</span> {invoiceData.nag}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <div className="w-1/2">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Total:</span>
            <span>{invoiceData.netAmount || "N/A"}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Previous Balance:</span>
            <span>{invoiceData.previousBalance || "N/A"}</span>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <span>Grand Total:</span>
            <span>{invoiceData.grandTotal || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintableInvoice;
