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
import axios from "./utils/axios";
import CreateCrushing from "./pages/CreateCrushing";
import CrushingRecords from "./pages/CrushingHistory";
import UpdateStock from "./pages/UpdateStock";
import ContactManagement from "./pages/ContactMgmt";
import ProtectedRoute from "./pages/ProtectedRoute";
import LedgerPage from "./pages/Ledger";
import { Ledger, LedgerResults } from "./pages/SaleorPurchaseLedger";
import TotalBalance from "./pages/Totals";
import StockHistory from "./pages/StockHIstory";

export const server =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

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
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          <p className="mt-4 text-white text-xl font-semibold">Loading...</p>
        </div>
      </div>
    );
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
