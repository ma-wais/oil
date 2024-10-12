import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import PasswordChangeForm from "./pages/ChangePass";
import SaleReport from "./pages/SaleReport";
import SaleAddTable from "./pages/ProductTable";
import Header from "./components/Header";
import PurchaseInv from "./pages/Purchase";
import PurchaseInvoiceList from "./pages/PurchaseList";
import SalesInvoiceList from "./pages/SaleList";
import StockSummaryReport from "./pages/Stock";
import Login from "./pages/Login";
import Register from "./pages/Register";
import axios from "axios";
import CreateCrushing from "./pages/CreateCrushing";
import CrushingRecords from "./pages/CrushingHistory";
import UpdateStock from "./pages/UpdateStock";
import ContactManagement from "./pages/ContactMgmt";
import ProtectedRoute from "./pages/ProtectedRoute";
import LedgerPage from "./pages/Ledger";
import { Ledger, LedgerResults } from "./pages/SaleorPurchaseLedger";
// import {PartyLedger, PartyLedgerResults} from "./pages/PartyLedger";
import TotalBalance from "./pages/Totals";
import StockHistory from "./pages/StockHIstory";

// export const server = "http://localhost:5000/api";
export const server = "https://oil-api-grn9.onrender.com/api"

function App() {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(sessionStorage.getItem("token"));

  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${server}/user`, {
          withCredentials: true,
        });
        setUser(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };
    if (token) {
      getUser();
    } else {
      console.log("no token");
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <BrowserRouter>
      <Header setToken={setToken} setUser={setUser} />
      <Routes>
        <Route element={<ProtectedRoute token={token} />}>
          <Route path="/home" element={<Home />} />
          <Route path="/changepass" element={<PasswordChangeForm />} />
          <Route path="/sale-report" element={<SaleReport />} />
          <Route path="/sale-invoice" element={<SaleAddTable />} />
          <Route path="/sale-list" element={<SalesInvoiceList />} />
          <Route path="/wealth-invoice" element={<PurchaseInv />} />
          <Route path="/wealth-list" element={<PurchaseInvoiceList />} />
          <Route path="/stock" element={<StockSummaryReport />} />
          <Route path="/crushing" element={<CreateCrushing />} />
          <Route path="/crushing-list" element={<CrushingRecords />} />
          <Route path="/stock-update" element={<UpdateStock />} />
          <Route path="/contact" element={<ContactManagement />} />
          <Route path="/contactledger" element={<LedgerPage />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/ledger-results" element={<LedgerResults />} />
          {/* <Route path="/party" element={<PartyLedger />} /> */}
          {/* <Route path="/party-ledger-results" element={<PartyLedgerResults />} /> */}
          <Route path="/totals" element={<TotalBalance />} />
          <Route path="/stock-history" element={<StockHistory />} />


        </Route>
        <Route
          path="/"
          element={
            <Login setToken={setToken} token={token} setUser={setUser} />
          }
        />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
