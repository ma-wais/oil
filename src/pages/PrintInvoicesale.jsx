import React from "react";

const PrintableInvoice = ({ invoiceData }) => {
  console.log("Invoice data received:", invoiceData);
  if (!invoiceData) {
    console.error("No invoice data received");
    return <div>Error: No invoice data available</div>;
  }

  if (!invoiceData.products || !Array.isArray(invoiceData.products)) {
    console.error("Invalid or missing items in invoice data");
    return <div>Error: Invalid invoice data structure {invoiceData.items}</div>;
  }
  const currentDate = new Date();

  return (
    <div
      className="p-8 bg-white text-black border m-auto my-4 border-gray-300 rounded-lg shadow-lg"
      style={{maxWidth: "310mm", minHeight: "160mm" }}
    >
      <div className="text-4xl font-extrabold mb-6 text-center text-gray-800">
        Oil Kohlu
      </div>
      <div className="flex justify-between mb-6">
        <div className="w-full">
          <div className="flex justify-between w-full">
            <p>
              <span className="font-semibold">Invoice No:</span>{" "}
              {invoiceData.billNo || "N/A"}
            </p>
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {invoiceData.date.slice(0, 10)}
            </p>
            <p>
              <span className="font-semibold">Party Name:</span>{" "}
              {invoiceData.customerName || "N/A"}
            </p>
          </div>
          <p className="my-5">
            <b>Issued On :</b> {currentDate.toDateString()}
          </p>

          <div className="mb-6 flex justify-between w-full gap-10">
            <table className="w-full border-collapse bg-gray-50">
              <thead className="bg-gray-200">
                <tr className="border-b-2 border-gray-300">
                  <th className="text-left py-2 px-4">Description</th>
                  <th className="text-right py-2 w-24">Quantity</th>
                  <th className="text-right py-2 w-24">Unit</th>
                  <th className="text-right py-2 w-24">Rate</th>
                  <th className="text-right py-2 w-24">Total</th>
                </tr>
              </thead>
              <tbody>
                {invoiceData.products.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-100"
                    }`}
                  >
                    <td className="py-2 px-4">{item.description || "N/A"}</td>
                    <td className="text-right py-2">
                      {item.quantity || "N/A"}
                    </td>
                    <td className="text-right py-2">{item.Unit || "N/A"}</td>
                    <td className="text-right py-2">{item.rate || "N/A"}</td>
                    <td className="text-right py-2">{item.total || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {invoiceData.carNo && (
              <div className="flex flex-col gap-4 w-60 bg-gray-100 p-4 border border-gray-300 rounded-md">
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
                  <span className="font-semibold">Gojar Khan Weight:</span>{" "}
                  {invoiceData.receivedWeight}
                </p>
                <p>
                  <span className="font-semibold">Nag:</span> {invoiceData.nag}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end mt-8">
            <div className="w-1/3 pt-4">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Total:</span>
                <span>{invoiceData.netAmount || invoiceData.totalAmount || "N/A"}</span>
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
      </div>
    </div>
  );
};

export default PrintableInvoice;
