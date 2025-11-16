import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import Swal from "sweetalert2";

const OngoingMatches = () => {
  const { upcoming, setLive, setUpcoming } = useContext(AuthContext);
  const [loadingMatchId, setLoadingMatchId] = useState(null);

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
  const navigate = useNavigate();
  const handleStartMatch = async (matchId) => {
    try {
      setLoadingMatchId(matchId);

      const res = await fetch(
        `http://localhost:3000/matches/start/${matchId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();

      if (data.success) {
        const match = upcoming.find((m) => m._id === matchId);

        if (!match) {
          return Toast.fire({
            icon: "error",
            title: `Match not Found.`,
          });
          return;
        }

        setUpcoming((prev) => prev.filter((m) => m._id !== matchId));

        setLive((prev) => [...prev, match]);
      }
    } catch (err) {
      console.error("Failed to start match:", err);
      //  return Toast.fire({
      //       icon: "error",
      //       title: `Failed to start match.`,
      //     });
    } finally {
      setLoadingMatchId(null);
    }
  };

  return (
    <div className="p-5 max-w-3xl mx-auto ">
      <h2 className="p-1 w-40 text-center mb-2 bg-gradient-to-r  rounded-2xl shadow-md shadow-blue-300 from-blue-600 to-purple-600 text-white">
        Waiting Matches
      </h2>

      {upcoming.length === 0 ? (
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
            No Waiting matches right now
          </span>
          <span className="text-white text-sm">
            Check back later for matches!
          </span>
        </div>
      ) : (
        <div className="space-y-4">
          {upcoming.map((m) => (
            <div
              key={m._id}
              className=" p-4 rounded-lg shadow-md shadow-gray-300 bg-white flex justify-between items-center hover:scale-[1.02]"
            >
              <div>
                <h3 className="text-lg font-bold">
                  {m.teamAName} vs {m.teamBName}
                </h3>
                <p className="text-sm text-gray-600">
                  {m.matchDate} — {m.matchTime}
                </p>
                <p className="text-sm text-gray-600">
                  Duration: {m.matchDuration} min
                </p>
              </div>

              <button
                onClick={() => handleStartMatch(m._id)}
                disabled={loadingMatchId === m._id}
                className={`px-4 py-2 shadow-md shadow-gray-300 rounded-lg text-white ${
                  loadingMatchId === m._id
                    ? "bg-gray-400"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loadingMatchId === m._id ? "Starting..." : "Start Match"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OngoingMatches;
