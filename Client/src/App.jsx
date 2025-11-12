import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet, useLocation } from "react-router-dom";
import AnnouncementMarquee from "./AnnouncementMarquee";
import Loading from "./Loading";
import { AuthContext } from "./AuthContext";
import Upcoming from "./Upcoming";
import Live from "./Live";
import AuthProvider from "./AuthProvider";
import Recent from "./Recent";
import image from "./image copy.png";


function App() {
  const [activeTab, setActiveTab] = useState("live");
  const location = useLocation();
  const [showSpinner, setShowSpinner] = useState(false);
  const { isLoading } = useContext(AuthContext);

  useEffect(() => {
    setShowSpinner(true);
    const timer = setTimeout(() => setShowSpinner(false),);
    return () => clearTimeout(timer);
  }, [location]);

  if (isLoading) return <Loading />;

  return (
    <div className="flex flex-col min-h-screen ">
      {showSpinner && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-50">
          <Loading />
        </div>
      )}

      <div className="sticky top-0 z-50 bg-base-100">
        <Navbar />

      </div>

      <div className="flex flex-col md:flex-row gap-6 min-h-screen bg-gray-50">
        <div className="flex-1 bg-white shadow-md rounded-2xl  ">
          <Outlet />
        </div>

        <div className="w-full md:w-[30%] bg-white shadow-md  pb-6 sticky top-20 h-[85vh] overflow-y-auto">
          {/* Tab Buttons  bg-gradient-to-r from-red-600 via-red-400 to-red-600*/}
          <div className="flex flex-row gap-3 mb-6 px-2  shadow-xl shadow-gray-200
               ">
            {["live", "recent", "upcoming"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full py-2 font-medium transition ${activeTab === tab
                    ? "text-red-400  "
                    : " border-red-600 hover:border-b-2  text-gray-700"
                  }`}
              >
          
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
           <AuthProvider>
        <div>
            {activeTab === "live" && <Live/>}
            {activeTab === "recent" && <Recent/>}
            {activeTab === "upcoming" && <Upcoming/>}
          </div>
    </AuthProvider>
       
        </div>
      </div>
    </div>
  );
}
export default App;