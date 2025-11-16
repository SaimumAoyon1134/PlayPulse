import React, { useContext, useEffect, useState } from "react";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import TurfDetails from "./TurfDetails";
import { AuthContext } from "./AuthContext";
import Loading from "./Loading";

const TurfList = () => {
  const [turfs, setTurfs] = useState([]);
  const [selectedTurf, setSelectedTurf] = useState(null);
  const { user } = useContext(AuthContext);

  const [loadingTurfs, setLoadingTurfs] = useState(true);

  // Fetch turfs
  useEffect(() => {
    setLoadingTurfs(true);
    fetch("https://playpulse-production.up.railway.app/turfs")
      .then((res) => res.json())
      .then(setTurfs)
      .catch(console.error)
      .finally(() => setLoadingTurfs(false));
  }, []);

  // Booking handler
  const handleBooking = async (turfId, slot, date) => {
    try {
      const res = await fetch(
        `https://playpulse-production.up.railway.app/turfs/${turfId}/book`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            slot,
            user: user?.email || "guest@example.com",
            date,
          }),
        }
      );

      if (!res.ok) {
        const err = await res.json();
        alert(err.message || "Booking failed");
        return false;
      }

      const data = await res.json();
      console.log("✅ Booking successful:", data);
      return true;
    } catch (err) {
      console.error("Booking Error:", err);
      return false;
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full py-10 px-4 bg-gray-50">
      {/* <h1 className="text-3xl w-full hover: bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white mb-5 font-semibold py-2  text-center">
        Football Turfs
      </h1> */}

      {loadingTurfs ? (
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      ) : turfs.length === 0 ? (
        <p className="text-gray-500 text-center">No turfs available</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {turfs.map((turf) => (
            <div
              key={turf._id}
              className="hover:bg-gradient-to-br from-red-100 via-yellow-50 to-green-100 shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col"
            >
              <img
                src={turf.image}
                alt={turf.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    {turf.name}
                  </h2>
                  <p className="text-gray-600 text-sm flex items-center">
                    <AddLocationIcon className="text-red-600 mr-1" />{" "}
                    {turf.location}
                  </p>
                  <p className="text-green-600 font-semibold mt-1">
                    {turf.price} BDT / hour
                  </p>
                </div>

                <button
                  className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-semibold"
                  onClick={() => setSelectedTurf(turf)}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedTurf && (
        <TurfDetails
          selectedTurf={selectedTurf}
          handleBooking={handleBooking}
          setSelectedTurf={setSelectedTurf}
        />
      )}
    </div>
  );
};

export default TurfList;
