import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PasswordChangeForm from "./pages/ChangePAss";
import SaleReport from "./pages/SaleReport";
import SaleAddTable from "./pages/ProductTable";
import Header from "./components/Header";
import PurchaseInv from "./pages/Purchase";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/changepass" element={<PasswordChangeForm />} />
        <Route path="/sale-report" element={<SaleReport />} />
        <Route path="/sale-invoice" element={<SaleAddTable />} />
        <Route path="/wealth-invoice" element={<PurchaseInv />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
