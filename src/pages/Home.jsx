import { IoNewspaperOutline, IoStatsChartSharp } from "react-icons/io5";
import { TfiStatsDown, TfiStatsUp } from "react-icons/tfi";
import { Link } from "react-router-dom";
import "./home.css";

const QuickLinkButton = ({ icon, label, to }) => (
  <Link to={to} className="flex flex-col items-center py-5 bg-white rounded">
    {icon}
    {label}
  </Link>
);

const Home = () => {

  return (
    <div className="min-h-screen bg-gray-100">

      <main className="p-4">
        <section className="bg-blue-100 rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* <QuickLinkButton icon={<FaCalculator />} label="Account Name" /> */}
            <QuickLinkButton icon={<IoNewspaperOutline />} label="Cash In" to={"/wealth-invoice"}/>
            <QuickLinkButton icon={<IoStatsChartSharp />} label="Stock" to={"/stock"}/>
            <QuickLinkButton icon={<TfiStatsUp />} label="Sales" to={"/sale-list"} />
            <QuickLinkButton icon={<TfiStatsDown />} label="Purchases" to={"/wealth-list"} />
            <QuickLinkButton
              icon={<IoNewspaperOutline />}
              label="Sell Report "
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
