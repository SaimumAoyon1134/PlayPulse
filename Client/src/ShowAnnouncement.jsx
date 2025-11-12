import React, { useEffect, useState } from "react";

const ShowAnnouncement = ({ announcements, setAnnouncements }) => {
  const fetchAnnouncements = async () => {
    try {
      const res = await fetch(
        "https://play-pulse-ivory.vercel.app/announcement"
      );
      const data = await res.json();
      setAnnouncements(data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(
        `https://play-pulse-ivory.vercel.app/announcement/${id}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.deletedCount) {
        console.log("Deleted successfully");
        setAnnouncements((prev) => prev.filter((item) => item._id !== id));
      }
    } catch (err) {
      console.error("Error deleting announcement:", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  if (!announcements.length)
    return <p className="text-gray-500">No announcements yet.</p>;

  return (
    <ul className="space-y-4">
      {announcements.map((item) => (
        <li
          key={item._id}
          className="bg-white rounded-xl p-4 flex justify-between items-center border-l-4 border-indigo-500 shadow-md shadow-gray-200"
        >
          <span>{item.announcement}</span>
          <button
            className="text-red-500 font-semibold hover:text-red-700 border border-red-500 rounded-2xl px-2"
            onClick={() => handleDelete(item._id)}
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
};

export default ShowAnnouncement;
