import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import MatchManagement from "./MatchManagement";
import Swal from "sweetalert2";

const MyLive = () => {
  const { live = [], fetchMatches } = useContext(AuthContext);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [endingId, setEndingId] = useState(null);
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  const openManager = (match) => {
    setSelectedMatch(match);
  };

  const closeManager = async () => {
    setSelectedMatch(null);
    // refresh lists from server
    if (fetchMatches) await fetchMatches();
  };

  const handleEndMatch = async (matchId) => {
    try {
      setEndingId(matchId);
      const res = await fetch(
        `https://playpulse-production.up.railway.app/matches/${matchId}/end`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (data.success) {
        // refresh lists
        if (fetchMatches) await fetchMatches();
      } else {
        console.error("End match failed", data);
        alert("Failed to end match. See console.");
      }
    } catch (err) {
      console.error("Failed to end match:", err);
      alert("Error ending match. See console.");
    } finally {
      setEndingId(null);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="p-1 w-40 text-center mb-2 bg-gradient-to-r  rounded-2xl shadow-md shadow-blue-300 from-blue-600 to-purple-600 text-white">
        Live Matches
      </h2>

      {live.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-8 rounded-xl bg-red-400  shadow-md border border-gray-200 space-y-3">
          <svg
            className="w-12 h-12 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 17v-2a4 4 0 018 0v2m-4-4v4m0-4H7m10 0h-2"
            />
          </svg>
          <span className="text-white text-lg font-medium">
            No live matches right now
          </span>
          <span className="text-white text-sm">
            Check back later for upcoming matches!
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {live.map((m) => (
            <div
              key={m._id}
              className="hover:scale-[1.02] p-4 rounded-lg shadow-md shadow-gray-300 bg-white flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold">
                  {m.teamAName} vs {m.teamBName}
                </h3>
                <p className="text-sm text-gray-600">
                  {m.matchDate} — {m.matchTime}
                </p>
                <p className="text-sm text-green-600 font-semibold">Live</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openManager(m)}
                  className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700"
                >
                  Manage
                </button>

                <button
                  onClick={() => handleEndMatch(m._id)}
                  disabled={endingId === m._id}
                  className={`px-4 py-2 rounded-lg text-white ${
                    endingId === m._id
                      ? "bg-gray-400"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {endingId === m._id ? "Ending..." : "Finish"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inline manager modal / panel */}
      {selectedMatch && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl">
            <MatchManagement match={selectedMatch} goBack={closeManager} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLive;
