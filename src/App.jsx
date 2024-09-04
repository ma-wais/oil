import React from "react";
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
import { IoNewspaperOutline, IoStatsChartSharp  } from "react-icons/io5";
import { TfiStatsDown, TfiStatsUp } from "react-icons/tfi";

const NavButton = ({ icon, label }) => (
  <button className="flex flex-col items-center justify-center p-2 text-xs">
    {icon}
    <span>{label}</span>
  </button>
);

const QuickLinkButton = ({ icon, label }) => (
  <button className="flex flex-col items-center justify-center p-4 bg-white rounded-lg shadow">
    {icon}
    <span className="mt-2 text-sm">{label}</span>
  </button>
);

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <h1 className="px-4 py-2 text-xl font-bold">Akram & Sons Faisalabad</h1>
        <nav className="flex justify-between px-4 py-2 bg-gray-200">
        <NavButton icon={<FaHome className="text-2xl" />} label="Homepage" />
        {/* <NavButton icon={<FaCog className="text-2xl" />} label="Back Office" /> */}
        {/* <NavButton icon={<FaClipboardList className="text-2xl" />} label="rooker" /> */}
        <NavButton icon={<FaUserPlus className="text-2xl" />} label="ADD New" />
        <NavButton icon={<FaHandHoldingUsd className="text-2xl" />} label="Wealth came" />
        <NavButton icon={<FaExchangeAlt className="text-2xl" />} label="Sale of goods" />
        {/* <NavButton icon={<FaTruck className="text-2xl" />} label="bulty" /> */}
        {/* <NavButton icon={<FaCalculator className="text-2xl" />} label="Account" /> */}
        <NavButton icon={<FaChartBar className="text-2xl" />} label="Stock" />
        <NavButton icon={<FaFileAlt className="text-2xl" />} label="report" />
        <NavButton icon={<FaSignOutAlt className="text-2xl" />} label="Logout" />

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
            <QuickLinkButton icon={<IoNewspaperOutline />} label="Sell Report " />
            <QuickLinkButton icon={<IoStatsChartSharp />} label="Stock Summary " />

          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
