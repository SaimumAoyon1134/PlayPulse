import React, { useState, useEffect, useContext } from "react";
import ShowAnnouncement from "./ShowAnnouncement";
import AnnouncementMarquee from "./AnnouncementMarquee";
import { AuthContext } from "./AuthContext";

const ManageAnnouncement = () => {
 const {announcements, setAnnouncements} = useContext(AuthContext);

  
  useEffect(() => {
    const getAnnouncements = async () => {
      try {
        const res = await fetch("http://localhost:3000/announcement");
        const data = await res.json();
        setAnnouncements(data);
      } catch (err) {
        console.error("Error fetching announcements:", err);
      }
    };
    getAnnouncements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const announce = e.target.announcement.value;

    try {
      const res = await fetch("http://localhost:3000/announcement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ announcement: announce }),
      });
      const data = await res.json();

      if (data.insertedId) {
  
        setAnnouncements((prev) => [
          ...prev,
          { _id: data.insertedId, announcement: announce },
        ]);
        e.target.reset();
      }
    } catch (err) {
      console.error("Error submitting announcement:", err);
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start bg-gradient-to-r from-gray-50 to-gray-100 ">

      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md transition-all duration-300 hover:shadow-2xl mt-6">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Manage Announcements
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-400 w-full rounded-xl h-12 px-4 outline-none text-gray-700 transition-all"
            type="text"
            name="announcement"
            placeholder="Enter your announcement..."
            required
          />
          <button
            type="submit"
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-all shadow-md hover:shadow-lg"
          >
            Publish Announcement
          </button>
        </form>
      </div>

      <div className="w-full max-w-3xl mt-12">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          📢 Recent Announcements
        </h3>
        <ShowAnnouncement announcements={announcements} setAnnouncements={setAnnouncements} />
      </div>
    </div>
  );
};

export default ManageAnnouncement;