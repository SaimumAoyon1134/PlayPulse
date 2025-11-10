import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";

const AnnouncementMarquee = () => {
 const {announcements, setAnnouncements} = useContext(AuthContext);
  if (!announcements || announcements.length === 0) return null;

  return (
    <div className="bg-red-400 text-white w-full  shadow-sm font-extrabold">
      <marquee behavior="scroll" direction="left" scrollamount="6">
        {announcements.map((item) => item.announcement).join(" ⚡  ")}
      </marquee>
    </div>
  );
};

export default AnnouncementMarquee;