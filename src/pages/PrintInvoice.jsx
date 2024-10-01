import React from "react";

const PrintableInvoicePage = ({ invoiceData }) => {
  return (
    <div className="w-[210mm] min-h-[297mm] p-8 bg-white text-black mx-auto">
      <div className="text-2xl font-bold mb-4">Invoice</div>
      <div className="flex gap-10 mb-10">
        <p>
          <span className="font-semibold">Invoice No:</span>{" "}
          {invoiceData.billNo}
        </p>
        <p>
          <span className="font-semibold">Date:</span> {invoiceData.date.slice(0, 10)}
        </p>
        <p>
          <span className="font-semibold">Party Name:</span>{" "}
          {invoiceData.customerName}
        </p>
      </div>
      <div className="mb-6 flex justify-between w-full gap-10">
        <table className="mb-6" style={{ width:  invoiceData.details ? "80%" : "100%" }}>
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
            {invoiceData?.items.map((product, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2">{product.description}</td>
                <td className="text-right py-2">{product.quantity}</td>
                <td className="text-right py-2">{product.weight}</td>
                <td className="text-right py-2">{product.rate}</td>
                <td className="text-right py-2">{product.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {invoiceData.details && (
          <div className="!w-full flex flex-col gap-4">
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
      </div>

      <div className="flex justify-end">
        <div className="w-1/2">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Total:</span>
            <span>{invoiceData.totalAmount}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Previous Balance:</span>
            <span>{invoiceData.previousBalance}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">{invoiceData.receivedCash && "Received"}</span>
            <span>{invoiceData.receivedCash}</span>
          </div>
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
