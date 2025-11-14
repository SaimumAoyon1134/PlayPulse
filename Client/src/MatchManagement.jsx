import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const MatchManagement = () => {
  const { live, fetchMatches } = useContext(AuthContext);
  const [matchData, setMatchData] = useState({}); 
  const [loadingMatchId, setLoadingMatchId] = useState(null);

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
   
    const initData = {};
    live.forEach((m) => {
      initData[m._id] = {
        teamAScore: 0,
        teamBScore: 0,
        teamAGoals: 0,
        teamBGoals: 0,
        teamAFouls: 0,
        teamBFouls: 0,
      };
    });
    setMatchData(initData);
  }, [live]);

  const handleChange = (matchId, field, value) => {
    setMatchData((prev) => ({
      ...prev,
      [matchId]: { ...prev[matchId], [field]: Number(value) },
    }));
  };

  const handleEndMatch = async (matchId) => {
    try {
      setLoadingMatchId(matchId);
      const res = await fetch(
        `https://play-pulse-ivory.vercel.app/matches/${matchId}/end`,
        { method: "PATCH" }
      );
      const data = await res.json();
      if (data.success) {
        alert("Match ended successfully!");
        fetchMatches();
      }
    } catch (err) {
      console.error("Failed to end match:", err);
    } finally {
      setLoadingMatchId(null);
    }
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Live Match Management</h2>
      {live.length === 0 ? (
        <p>No live matches currently.</p>
      ) : (
        live.map((m) => (
          <div
            key={m._id}
            className="border p-4 rounded-lg shadow mb-4 bg-white"
          >
            <h3 className="text-lg font-semibold mb-2">
              {m.teamAName} vs {m.teamBName}
            </h3>
            <p className="text-sm text-gray-600">
              Date: {m.matchDate} — Time: {m.matchTime}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold">{m.teamAName} Stats</h4>
                <p>Players: {m.teamA.join(", ")}</p>
                <label>
                  Score:
                  <input
                    type="number"
                    value={matchData[m._id]?.teamAScore || 0}
                    onChange={(e) =>
                      handleChange(m._id, "teamAScore", e.target.value)
                    }
                    className="border ml-2 p-1 w-20"
                  />
                </label>
                <br />
                <label>
                  Goals:
                  <input
                    type="number"
                    value={matchData[m._id]?.teamAGoals || 0}
                    onChange={(e) =>
                      handleChange(m._id, "teamAGoals", e.target.value)
                    }
                    className="border ml-2 p-1 w-20"
                  />
                </label>
                <br />
                <label>
                  Fouls:
                  <input
                    type="number"
                    value={matchData[m._id]?.teamAFouls || 0}
                    onChange={(e) =>
                      handleChange(m._id, "teamAFouls", e.target.value)
                    }
                    className="border ml-2 p-1 w-20"
                  />
                </label>
              </div>

              <div>
                <h4 className="font-semibold">{m.teamBName} Stats</h4>
                <p>Players: {m.teamB.join(", ")}</p>
                <label>
                  Score:
                  <input
                    type="number"
                    value={matchData[m._id]?.teamBScore || 0}
                    onChange={(e) =>
                      handleChange(m._id, "teamBScore", e.target.value)
                    }
                    className="border ml-2 p-1 w-20"
                  />
                </label>
                <br />
                <label>
                  Goals:
                  <input
                    type="number"
                    value={matchData[m._id]?.teamBGoals || 0}
                    onChange={(e) =>
                      handleChange(m._id, "teamBGoals", e.target.value)
                    }
                    className="border ml-2 p-1 w-20"
                  />
                </label>
                <br />
                <label>
                  Fouls:
                  <input
                    type="number"
                    value={matchData[m._id]?.teamBFouls || 0}
                    onChange={(e) =>
                      handleChange(m._id, "teamBFouls", e.target.value)
                    }
                    className="border ml-2 p-1 w-20"
                  />
                </label>
              </div>
            </div>

            <button
              onClick={() => handleEndMatch(m._id)}
              disabled={loadingMatchId === m._id}
              className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded"
            >
              {loadingMatchId === m._id ? "Ending..." : "End Match"}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MatchManagement;