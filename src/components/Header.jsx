import axios from "../utils/axios";
import React, { useState } from "react";
import {
  FaHome,
  FaCog,
  FaUserPlus,
  FaHandHoldingUsd,
  FaChartBar,
} from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { server } from "../App";

const Header = ({ setToken, setUser }) => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);
  const location = useLocation();

  if (location.pathname.includes("results") || location.pathname === "/") {
    return null;
  }

  const dropdownItems = {
    boxOffice: [{ to: "/changepass", label: "Change Password" }],
    crushings: [
      { to: "/crushing", label: "Crushing" },
      { to: "/crushing-list", label: "Crushing Records" },
    ],
    wealth: [
      { to: "/wealth-invoice", label: "Purchase Invoice" },
      { to: "/wealth-list", label: "Purchase List" },
    ],
    sales: [
      { to: "/sale-invoice", label: "Sale Invoice" },
      { to: "/sale-list", label: "Sale List" },
    ],
    stock: [
      { to: "/stock", label: "Stock" },
      { to: "/stock-update", label: "Stock Update" },
      { to: "/stock-history", label: "Stock History" },
    ],
    stakeholders: [
      { to: "/contact", label: "Stakeholders" },
      { to: "/contactledger", label: "Balance Records" },
      {
        to: "/ledger",
        label: "Account Ledger",
      },
      // {
      //   to: "/party",
      //   label: "Party Ledger",
      // },
      { to: "/totals", label: "Total Payable and Recievable" },
    ],
  };

  const logout = async () => {
    try {
      await axios.post(`${server}/logout`, {}, { withCredentials: true });

      sessionStorage.removeItem("token");
      setToken(null);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  const handleDropdownToggle = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleDropdownItemClick = () => {
    setOpenDropdown(null);
  };

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <nav className="flex justify-between items-center px-6 py-2 bg-gradient-to-r from-slate-50 to-slate-100">
        <div className="flex flex-wrap gap-2">
          <NavButton
            icon={
              <Link to="/home">
                <FaHome className="text-xl" />
              </Link>
            }
            label="Homepage"
          />
          <NavButton
            icon={<FaHandHoldingUsd className="text-xl" />}
            label="Sale of goods"
            hasDropdown
            dropdownItems={dropdownItems.sales}
            isOpen={openDropdown === "sales"}
            onToggle={() => handleDropdownToggle("sales")}
            onItemClick={handleDropdownItemClick}
          />
          <NavButton
            icon={<FaUserPlus className="text-xl" />}
            label="Purchase"
            hasDropdown
            dropdownItems={dropdownItems.wealth}
            isOpen={openDropdown === "wealth"}
            onToggle={() => handleDropdownToggle("wealth")}
            onItemClick={handleDropdownItemClick}
          />
          <NavButton
            icon={<FaHandHoldingUsd className="text-xl" />}
            label="Stock"
            hasDropdown
            dropdownItems={dropdownItems.stock}
            isOpen={openDropdown === "stock"}
            onToggle={() => handleDropdownToggle("stock")}
            onItemClick={handleDropdownItemClick}
          />
          <NavButton
            icon={<FaCog className="text-xl" />}
            label="Crushings"
            hasDropdown
            dropdownItems={dropdownItems.crushings}
            isOpen={openDropdown === "crushings"}
            onToggle={() => handleDropdownToggle("crushings")}
            onItemClick={handleDropdownItemClick}
          />
          <Link to={"/sale-report"}>
            <NavButton
              icon={<FaChartBar className="text-xl" />}
              label="Report"
            />
          </Link>
          <NavButton
            icon={<FaCog className="text-xl" />}
            label="Back Office"
            hasDropdown
            dropdownItems={dropdownItems.boxOffice}
            isOpen={openDropdown === "boxOffice"}
            onToggle={() => handleDropdownToggle("boxOffice")}
            onItemClick={handleDropdownItemClick}
          />

          <NavButton
            icon={<FaUserPlus className="text-xl" />}
            label="Stakeholders"
            hasDropdown
            dropdownItems={dropdownItems.stakeholders}
            isOpen={openDropdown === "stakeholders"}
            onToggle={() => handleDropdownToggle("stakeholders")}
            onItemClick={handleDropdownItemClick}
          />
        </div>

        <button
          onClick={() => logout()}
          className="px-6 py-2.5 text-sm font-semibold bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 shadow-md hover:shadow-lg transition-all duration-300"
        >
          Log Out
        </button>
      </nav>
    </header>
  );
};

const NavButton = ({
  icon,
  label,
  to,
  hasDropdown,
  dropdownItems,
  isOpen,
  onToggle,
  onItemClick,
}) => {
  return (
    <div className="relative nav-button">
      <button
        onClick={hasDropdown ? onToggle : undefined}
        className="flex flex-col p-1 items-center"
      >
        {icon}
        {label}
      </button>
      {hasDropdown && isOpen && (
        <div className="dropdown z-10">
          {dropdownItems.map((item, index) => (
            <Link
              key={index}
              to={item.to}
              className="block p-2 border-b"
              onClick={onItemClick}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Header;
