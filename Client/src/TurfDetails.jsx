import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";

const TurfDetails = ({ selectedTurf, handleBooking, setSelectedTurf }) => {
  const { user } = useContext(AuthContext);

  // Local state for bookings & date
  const [bookings, setBookings] = useState(selectedTurf.bookings || []);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [loadingSlot, setLoadingSlot] = useState(null);

  // Function to filter out past bookings
  const filterFutureBookings = (allBookings) => {
    const now = new Date();
    return allBookings.filter((b) => new Date(`${b.date}T${b.end}:00`) > now);
  };

  // Keep bookings updated in real-time (every minute)
  useEffect(() => {
    const interval = setInterval(() => {
      setBookings((prev) => filterFutureBookings(prev));
    }, 60000); // every 60 seconds
    return () => clearInterval(interval);
  }, []);

  // Filter bookings for selected date and future
  const futureBookings = filterFutureBookings(
    bookings.filter((b) => b.date === selectedDate)
  );

  // Remaining slots for selected date
  const remainingSlots =
    selectedTurf.slots?.filter(
      (slot) =>
        !futureBookings.some(
          (b) => b.start === slot.start && b.end === slot.end
        )
    ) || [];

  // Handle booking a slot
  // const handleSlotBooking = async (slot) => {
  //   if (!user?.email) {
  //     alert("You must be logged in to book a slot!");
  //     return;
  //   }

  //   setLoadingSlot(slot.start);
  //   const success = await handleBooking(selectedTurf._id, slot, selectedDate);
  //   if (success) {
  //     setBookings((prev) => [
  //       ...prev,
  //       { ...slot, date: selectedDate, user: user.email },

        
  //     ]);
  //     const data = { ...slot, date: selectedDate, user: user.displayName };
  //     console.log(data)
  //   }
  //   setLoadingSlot(null);
  // };
  const handleSlotBooking = async (slot) => {
  if (!user?.email) {
    alert("You must be logged in to book a slot!");
    return;
  }

  setLoadingSlot(slot.start);

  try {
    // Call your existing turf booking logic
    const success = await handleBooking(selectedTurf._id, slot, selectedDate);

    if (success) {
      // Construct booking data to save in the new collection
      const bookingData = {
        turfId: selectedTurf._id,
        turfName: selectedTurf.name,
        user: user.displayName || user.email,
        email: user.email,
        date: selectedDate,
        start: slot.start,
        end: slot.end,
        price: selectedTurf.price,
        status: "Booked",
        createdAt: new Date(),
      };

      // Save booking in MongoDB (bookings collection)
      const res = await fetch("http://localhost:3000/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const data = await res.json();

      if (data.success) {
        alert("✅ Booking confirmed!");
        // Update local state so UI updates instantly
        setBookings((prev) => [
          ...prev,
          { ...slot, date: selectedDate, user: user.email },
        ]);
      } else {
        alert("❌ Failed to save booking in database!");
      }
    }
  } catch (err) {
    console.error(err);
    alert("⚠️ Something went wrong while booking!");
  }

  setLoadingSlot(null);
};

  // Check if a slot is booked
  const isSlotBooked = (slot) =>
    futureBookings.some((b) => b.start === slot.start && b.end === slot.end);

  return (
    <dialog
      open
      className="modal modal-bottom sm:modal-middle bg-black/30 backdrop-blur-sm"
    >
      <div className="modal-box max-w-lg bg-white rounded-2xl shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={() => setSelectedTurf(null)}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
        >
          ✕
        </button>

        {/* Turf Header */}
        <h2 className="text-2xl font-bold text-green-600 mb-3 text-center">
          {selectedTurf.name}
        </h2>

        <img
          src={selectedTurf.image}
          alt={selectedTurf.name}
          className="w-full h-56 object-cover rounded-lg mb-4"
        />

        {/* Date Picker */}
        <div className="mb-3">
          <label className="font-semibold mr-2">Select Date:</label>
          <input
            type="date"
            className="border rounded px-2 py-1"
            value={selectedDate}
            min={new Date().toISOString().split("T")[0]}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        {/* Turf Info */}
        <div className="space-y-2 text-gray-700">
          <p>
            <strong>📍 Location:</strong> {selectedTurf.location}
          </p>
          <p>
            <strong>📞 Contact:</strong> {selectedTurf.mobile}
          </p>
          <p>
            <strong>💰 Price:</strong> {selectedTurf.price} BDT / hour
          </p>
        </div>

        {/* Slots */}
        {selectedTurf.slots?.length > 0 ? (
          <div className="mt-5">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-800">Available Slots:</h3>
              <p className="text-sm text-gray-500">
                🕒 Remaining:{" "}
                <span className="font-semibold text-green-600">
                  {remainingSlots.length}
                </span>
                /{selectedTurf.slots.length}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto mt-2">
              {selectedTurf.slots.map((slot, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSlotBooking(slot)}
                  disabled={isSlotBooked(slot) || loadingSlot === slot.start}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all ${
                    isSlotBooked(slot)
                      ? "bg-gray-300 text-gray-600 border-gray-400 cursor-not-allowed"
                      : loadingSlot === slot.start
                      ? "bg-green-300 border-green-400 text-white"
                      : "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                  }`}
                >
                  {slot.start} - {slot.end}{" "}
                  {isSlotBooked(slot)
                    ? " (Booked)"
                    : loadingSlot === slot.start
                    ? "Booking..."
                    : ""}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 mt-4">No slots available</p>
        )}

        {/* Close Button */}
        <div className="modal-action mt-6">
          <button
            className="btn w-full bg-red-500 hover:bg-red-600 text-white"
            onClick={() => setSelectedTurf(null)}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default TurfDetails;