import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom"; 

const OngoingMatches = () => {
  const { ongoing, setLive, setOngoing } = useContext(AuthContext);
  const [loadingMatchId, setLoadingMatchId] = useState(null);
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
      // Safely find match
      const match = ongoing.find((m) => m._id === matchId);

      if (!match) {
        console.error("Match not found in ongoing:", matchId);
        return;
      }

      // Remove from waiting
      setOngoing((prev) => prev.filter((m) => m._id !== matchId));

      // Add to live
      setLive((prev) => [...prev, match]);

      // Do NOT navigate
      // MatchManagement now opens from MyLive context, not route
    }
  } catch (err) {
    console.error("Failed to start match:", err);
  } finally {
    setLoadingMatchId(null);
  }
};

  return (
    <div className="p-5 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Waiting Matches</h2>

      {ongoing.length === 0 ? (
        <p className="text-gray-500">No waiting matches to start.</p>
      ) : (
        <div className="space-y-4">
          {ongoing.map((m) => (
            <div
              key={m._id}
              className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center"
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
                className={`px-4 py-2 rounded-lg text-white ${
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