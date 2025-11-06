import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";
import AnnouncementMarquee from "./AnnouncementMarquee";
import Loading from "./Loading";

function App() {
  const [activeTab, setActiveTab] = useState("live");

  return (
    <div className="flex flex-col min-h-screen">
 
      <div className="sticky top-0 z-50 bg-base-100">
        <Navbar />
        <AnnouncementMarquee />
      </div>


      <div className="flex flex-col md:flex-row gap-6 p-6 min-h-screen bg-gray-50">

        <div className="flex-1 bg-white shadow-md rounded-2xl p-6">
          <Outlet /> 
        </div>

  
        <div className="w-full md:w-[30%] bg-white shadow-md rounded-2xl p-6 sticky top-24 h-[90vh] overflow-y-auto">
          
          <div className="flex flex-row gap-3 mb-6 border pb-2 shadow-xl shadow-gray-200 bg-gray-100 rounded-2xl p-2">
            <button
              onClick={() => setActiveTab("live")}
              className={`w-full  rounded-lg font-medium transition  ${
                activeTab === "live"
                  ? " text-red-400 bg-gray-100 "
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Live
            </button>
            <button
              onClick={() => setActiveTab("recent")}
              className={`w-full py-2 rounded-lg font-medium transition ${
                activeTab === "recent"
                  ? " text-red-400 bg-gray-100"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Recent
            </button>
            <button
              onClick={() => setActiveTab("upcoming")}
              className={`w-full py-2 rounded-lg font-medium transition ${
                activeTab === "upcoming"
                  ? " text-red-400 bg-gray-100"
                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
              }`}
            >
              Upcoming
            </button>
          </div>

          <div>
            {activeTab === "live" && <div>Live Component</div>}
            {activeTab === "recent" && <div>Recent Component</div>}
            {activeTab === "upcoming" && <div>Upcoming Component</div>}
          </div>
        </div>
      </div>

    </div>
  );
}

export default App;