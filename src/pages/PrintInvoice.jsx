import React from "react";

const PrintableInvoicePage = ({ invoiceData }) => {
  console.log(invoiceData);
  return (
    <div className="w-[210mm] min-h-[297mm] p-8 bg-white text-black mx-auto">
      <div className="text-2xl font-bold mb-4">Invoice</div>
      <div className="flex justify-between mb-6 w-full">
        <div>
          <div className="flex gap-10 mb-10 !w-[80%]">
            <p>
              <span className="font-semibold">Invoice No:</span>{" "}
              {invoiceData.billNo}
            </p>
            <p>
              <span className="font-semibold">Date:</span> {invoiceData.date}
            </p>
            <p>
              <span className="font-semibold">Party Name:</span>{" "}
              {invoiceData.customerName}
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
              {invoiceData?.products.map((product, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2">{product.description}</td>
                  <td className="text-right py-2">{product.quantity}</td>
                  <td className="text-right py-2">{product.Unit}</td>
                  <td className="text-right py-2">{product.rate}</td>
                  <td className="text-right py-2">{product.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mr-10 flex flex-col gap-4">
          <p>
            <span className="font-semibold">Vehicle No:</span>{" "}
            {invoiceData.carNo}
          </p>
          <p>
            <span className="font-semibold">Vehicle Fare:</span>{" "}
            {invoiceData.carRent}
          </p>
          <p>
            <span className="font-semibold">Previous Weight:</span>{" "}
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
      </div>

      <div className="flex justify-end mr-10">
        <div className="w-1/2">
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Total:</span>
            <span>{invoiceData.netAmount}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="font-semibold">Previous Balance:</span>
            <span>{invoiceData.previousBalance}</span>
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
