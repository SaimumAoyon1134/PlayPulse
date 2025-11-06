import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";

const AnnouncementMarquee = () => {
 const {announcements, setAnnouncements} = useContext(AuthContext);
  if (!announcements || announcements.length === 0) return null;

  return (
    <div className="bg-gray-200 text-red-700 w-full rounded-md shadow-sm">
      <marquee behavior="scroll" direction="left" scrollamount="6">
        {announcements.map((item) => item.announcement).join(" ⚡  ")}
      </marquee>
    </div>
  );
};

export default AnnouncementMarquee;