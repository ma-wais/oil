import axios from "axios";
import React, { useState } from "react";
import {
  FaHome,
  FaCog,
  FaUserPlus,
  FaHandHoldingUsd,
  FaExchangeAlt,
  FaChartBar,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { server } from "../App";

const Header = ({setToken, setUser }) => {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  const dropdownItems = {
    boxOffice: [{ to: "/changepass", label: "Change Password" }],
    wealth: [
      { to: "/wealth-invoice", label: "Invoice" },
      { to: "/wealth-list", label: "List" },
    ],
    sales: [
      { to: "/sale-invoice", label: "Invoice" },
      { to: "/sale-list", label: "List" },
    ],
    // stock: [
    //   { to: "/stock-invoice", label: "Invoice" },
    //   // { to: "/stock-list", label: "List" },
    // ],
    // report: [{ to: "/sale-report", label: "Report" }],
  };

  const logout = async () => {
    try {
      await axios.post(`${server}/logout`, {}, { withCredentials: true });

      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      navigate("/login");
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
    <header className="bg-white shadow">
      <nav className="flex justify-center md:px-6 py-2 md:gap-6 bg-gray-200">
        <NavButton
          icon={
            <Link to="/">
              <FaHome className="text-xl" />
            </Link>
          }
          label="Homepage"
        />
        <NavButton
          icon={<FaCog className="text-xl" />}
          label="Box Office"
          hasDropdown
          dropdownItems={dropdownItems.boxOffice}
          isOpen={openDropdown === "boxOffice"}
          onToggle={() => handleDropdownToggle("boxOffice")}
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
          label="Sale of goods"
          hasDropdown
          dropdownItems={dropdownItems.sales}
          isOpen={openDropdown === "sales"}
          onToggle={() => handleDropdownToggle("sales")}
          onItemClick={handleDropdownItemClick}
        />
        <Link to={"/stock"}>
          <NavButton
            icon={<FaExchangeAlt className="text-xl" />}
            label="Stock"
          />
        </Link>
        <Link to={"/sale-report"}>
          <NavButton icon={<FaChartBar className="text-xl" />} label="Report" />
        </Link>
        <button
          onClick={() => logout()}
          className="px-2 h-10 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
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
        className="flex flex-col p-2 items-center"
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
