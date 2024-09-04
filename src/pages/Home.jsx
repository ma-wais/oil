import React, { useState } from "react";
import {
  FaHome,
  FaCog,
  FaClipboardList,
  FaUserPlus,
  FaHandHoldingUsd,
  FaExchangeAlt,
  FaTruck,
  FaCalculator,
  FaChartBar,
  FaFileAlt,
  FaSignOutAlt,
  FaPlus,
  FaBuyNLarge,
  FaSellsy,
} from "react-icons/fa";
import { IoNewspaperOutline, IoStatsChartSharp } from "react-icons/io5";
import { TfiStatsDown, TfiStatsUp } from "react-icons/tfi";
import { Link } from "react-router-dom";
import "./home.scss";

const NavButton = ({ icon, label, to, hasDropdown, dropdownItems }) => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="relative nav-button">
      <button
        onClick={hasDropdown ? toggleDropdown : undefined}
        className="flex flex-col p-2 items-center"
      >
        {icon}
        {label}
      </button>
      {hasDropdown && isDropdownOpen && (
        <div className="dropdown">
          {dropdownItems.map((item, index) => (
            <Link key={index} to={item.to} className="block px-4 py-2">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const QuickLinkButton = ({ icon, label, to }) => (
  <Link to={to} className="flex flex-col items-center py-5 bg-white rounded">
    {icon}
    {label}
  </Link>
);

const Home = () => {
  const dropdownItems = {
    boxOffice: [
        { to: "/changepass", label: "Change Password" },
      ],
    wealth: [
      { to: "/wealth-invoice", label: "Invoice" },
      { to: "/wealth-list", label: "List" },
    ],
    sales: [
      { to: "/sale-invoice", label: "Invoice" },
      { to: "/sale-list", label: "List" },
    ],
    stock: [
      { to: "/stock-invoice", label: "Invoice" },
      { to: "/stock-list", label: "List" },
    ],
    report: [
      { to: "/sale-report", label: "Report" },
    ]
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <h1 className="px-4 py-2 text-xl font-bold">Akram & Sons Faisalabad</h1>
        <nav className="flex justify-between px-4 py-2 bg-gray-200">
          <NavButton
            icon={<FaHome className="text-2xl" />}
            label="Homepage"
            to="/"
          />
          <NavButton
            icon={<FaCog className="text-2xl" />}
            label="Box Office"
            hasDropdown
            dropdownItems={dropdownItems.boxOffice}
          />
          {/* <NavButton
            icon={<FaClipboardList className="text-2xl" />}
            label="Add New"
            hasDropdown
            dropdownItems={dropdownItems}
          /> */}
          <NavButton
            icon={<FaUserPlus className="text-2xl" />}
            label="Wealth came"
            hasDropdown
            dropdownItems={dropdownItems.wealth}
          />
          <NavButton
            icon={<FaHandHoldingUsd className="text-2xl" />}
            label="Sale of goods"
            hasDropdown
            dropdownItems={dropdownItems.sales}
          />
          <NavButton
            icon={<FaExchangeAlt className="text-2xl" />}
            label="Stock"
            hasDropdown
            dropdownItems={dropdownItems.stock}
          />
          <NavButton
            icon={<FaChartBar className="text-2xl" />}
            label="Report"
            hasDropdown
            dropdownItems={dropdownItems.report}
          />
          <button
            className="px-2 h-10 mt-4 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Log Out
          </button>
        </nav>
      </header>
      <main className="p-4">
        <section className="bg-blue-100 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <QuickLinkButton icon={<FaCalculator />} label="Account Name" />
            <QuickLinkButton icon={<IoNewspaperOutline />} label="Cash In" />
            <QuickLinkButton icon={<IoNewspaperOutline />} label="Cash Out" />
            <QuickLinkButton icon={<IoStatsChartSharp />} label="Stock" />
            <QuickLinkButton icon={<TfiStatsUp />} label="Sales" />
            <QuickLinkButton icon={<TfiStatsDown />} label="Purchase" />
            <QuickLinkButton
              icon={<IoNewspaperOutline />}
              label="Sell Report "
            />
            <QuickLinkButton
              icon={<IoStatsChartSharp />}
              label="Stock Summary "
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
