import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    fetch(`https://play-pulse-ivory.vercel.app/user/bookings/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setBookings(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [user]);

  const handleCancel = async (booking) => {
    try {
      const res = await fetch(
        `https://play-pulse-ivory.vercel.app/turfs/${booking.turfId}/cancel`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slot: { start: booking.slot.start, end: booking.slot.end },
            user,
            date: booking.date,
          }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        setBookings((prev) =>
          prev.filter(
            (b) =>
              !(
                b.turfId === booking.turfId &&
                b.date === booking.date &&
                b.slot.start === booking.slot.start &&
                b.slot.end === booking.slot.end
              )
          )
        );
        alert("Booking cancelled successfully");
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-2 bg-gradient-to-br from-red-100 via-yellow-50 to-green-100 h-full">
      <h1 className="text-3xl w-full bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white mb-5 font-semibold py-2  text-center">
        My Bookings
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">
          Loading your bookings...
        </p>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16  bg-gray-50 rounded-2xl shadow-inner bg-gradient-to-br from-red-100 via-yellow-50 to-green-100">
          <EventBusyIcon sx={{ fontSize: 60 }} className="text-gray-400 mb-3" />
          <p className="text-gray-500 text-lg">You have no active bookings.</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 px-4 ">
          {bookings.map((b, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl shadow-md hover:shadow-xl bg-gradient-to-br from-blue-100 via-red-50 to-green-100 transition-all duration-300 overflow-hidden flex flex-col"
            >
              <img
                src={b.turfImage}
                alt={b.turfName}
                className="w-full h-48 object-cover"
              />
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-1">
                    {b.turfName}
                  </h2>
                  <p className="flex items-center text-gray-600 text-sm mb-2">
                    <LocationOnIcon
                      fontSize="small"
                      className="text-red-500 mr-1"
                    />
                    {b.turfLocation}
                  </p>
                  <div className="flex justify-between items-center text-gray-700 mt-3">
                    <p className="flex items-center text-sm">
                      <CalendarTodayIcon
                        fontSize="small"
                        className="text-green-600 mr-1"
                      />
                      {b.date}
                    </p>
                    <p className="flex items-center text-sm">
                      <AccessTimeIcon
                        fontSize="small"
                        className="text-blue-600 mr-1"
                      />
                      {b.slot.start} - {b.slot.end}
                    </p>
                  </div>
                  <p className="flex items-center mt-3 font-medium text-green-700">
                    <MonetizationOnIcon
                      fontSize="small"
                      className="mr-1 text-yellow-500"
                    />
                    {b.turfPrice} BDT/hr
                  </p>
                </div>

                <button
                  onClick={() => handleCancel(b)}
                  className="mt-5 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition duration-200"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
