import { IoNewspaperOutline, IoStatsChartSharp } from "react-icons/io5";
import { TfiStatsDown, TfiStatsUp } from "react-icons/tfi";
import { Link } from "react-router-dom";
import "./home.css";

const QuickLinkButton = ({ icon, label, to, gradient }) => (
  <Link
    to={to}
    className="group relative flex flex-col items-center justify-center gap-3 py-8 px-6 bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden"
  >
    <div
      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
    ></div>
    <div
      className={`text-4xl p-4 rounded-full bg-gradient-to-br ${gradient} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}
    >
      {icon}
    </div>
    <span className="text-sm font-semibold text-gray-700 text-center group-hover:text-gray-900 transition-colors duration-300">
      {label}
    </span>
  </Link>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <main className="p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl h-16 font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2">
            Welcome to Oil Kohlu Management
          </h1>
          <p className="text-gray-600 text-lg">
            Quick access to your most used features
          </p>
        </div>

        <section className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm bg-opacity-90">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Quick Links</h2>
            <div className="h-1 flex-1 ml-4 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            <QuickLinkButton
              icon={<IoNewspaperOutline />}
              label="Cash In"
              to={"/wealth-invoice"}
              gradient="from-green-400 to-emerald-600"
            />
            <QuickLinkButton
              icon={<IoStatsChartSharp />}
              label="Stock"
              to={"/stock"}
              gradient="from-blue-400 to-indigo-600"
            />
            <QuickLinkButton
              icon={<TfiStatsUp />}
              label="Sales"
              to={"/sale-list"}
              gradient="from-purple-400 to-pink-600"
            />
            <QuickLinkButton
              icon={<TfiStatsDown />}
              label="Purchases"
              to={"/wealth-list"}
              gradient="from-orange-400 to-red-600"
            />
            <QuickLinkButton
              icon={<IoNewspaperOutline />}
              label="Sales Report"
              to={"/sale-report"}
              gradient="from-cyan-400 to-teal-600"
            />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
