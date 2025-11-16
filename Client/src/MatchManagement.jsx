import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";

const MatchManagement = ({ match, goBack }) => {
  const { players = [], fetchMatches } = useContext(AuthContext);

  const [playerStats, setPlayerStats] = useState({});

  const [teamTotals, setTeamTotals] = useState({
    teamAScore: 0,
    teamBScore: 0,
    teamAGoals: 0,
    teamBGoals: 0,
    teamAFouls: 0,
    teamBFouls: 0,
  });
  const [saving, setSaving] = useState(false);
  const [ending, setEnding] = useState(false);

  const playerById = {};
  players.forEach((p) => {
    playerById[String(p._id)] = p;
  });

  useEffect(() => {
    if (!match) return;

    // initialize playerStats for players included in match.teamA and match.teamB
    const init = {};
    const allIds = [...(match.teamA || []), ...(match.teamB || [])];

    allIds.forEach((p) => {
      // match.team arrays might contain full objects or ID strings
      const id = typeof p === "string" ? p : p._id ? String(p._id) : null;
      if (!id) return;
      init[id] = { goals: 0, fouls: 0, assists: 0 };
    });

    setPlayerStats(init);

    // initialize totals
    setTeamTotals({
      teamAScore: 0,
      teamBScore: 0,
      teamAGoals: 0,
      teamBGoals: 0,
      teamAFouls: 0,
      teamBFouls: 0,
    });
  }, [match, players]);

  // helper to persist stats to backend (PATCH /matches/:id/stats)
  const persistStats = async (partial = {}) => {
    try {
      const body = {
        stats: {
          teamAScore: teamTotals.teamAScore,
          teamBScore: teamTotals.teamBScore,
          teamAGoals: teamTotals.teamAGoals,
          teamBGoals: teamTotals.teamBGoals,
          teamAFouls: teamTotals.teamAFouls,
          teamBFouls: teamTotals.teamBFouls,
          ...partial.stats,
        },
        // send per-player contributions so server can update players
        playerStats,
      };
      const res = await fetch(
        `https://playpulse-production.up.railway.app/matches/${match._id}/stats`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      return res.json();
    } catch (err) {
      console.error("persistStats error", err);
      return null;
    }
  };

  // increment player stat (goal or foul) and update team totals
  const handlePlayerAction = async (playerId, action) => {
    setPlayerStats((prev) => {
      const copy = {
        ...prev,
        [playerId]: {
          ...(prev[playerId] || {}),
          goals: 0,
          fouls: 0,
          assists: 0,
        },
      };
      copy[playerId][action] = (copy[playerId][action] || 0) + 1;
      return copy;
    });

    setTeamTotals((prev) => {
      const next = { ...prev };
      // determine which team includes that player
      const isA = (match.teamA || []).some((p) => {
        const id = typeof p === "string" ? p : p._id ? String(p._id) : null;
        return id === playerId;
      });

      if (action === "goals") {
        if (isA) {
          next.teamAGoals = (next.teamAGoals || 0) + 1;
          next.teamAScore = (next.teamAScore || 0) + 1;
        } else {
          next.teamBGoals = (next.teamBGoals || 0) + 1;
          next.teamBScore = (next.teamBScore || 0) + 1;
        }
      } else if (action === "fouls") {
        if (isA) next.teamAFouls = (next.teamAFouls || 0) + 1;
        else next.teamBFouls = (next.teamBFouls || 0) + 1;
      } else if (action === "assists") {
        // optional: doesn't affect team score in this example
      }
      return next;
    });

    // optimistic persist: update player totals in DB (optional)
    await persistStats();
  };

  const handleSave = async () => {
    setSaving(true);
    const res = await persistStats();
    if (res && res.success) {
      Toast.fire({
        icon: "success",
        title: `Match Stat Saved.`,
      });
      if (fetchMatches) await fetchMatches();
    } else {
      Toast.fire({
        icon: "error",
        title: `Same Erorr Faced`,
      });
    }
    setSaving(false);
  };

  const handleEnd = async () => {
    try {
      setEnding(true);

      // Save stats final
      await persistStats();

      // call end endpoint
      const res = await fetch(
        `https://playpulse-production.up.railway.app/matches/${match._id}/end`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();
      if (data.success) {
        Toast.fire({
          icon: "success",
          title: `Match Ended.`,
        });
        if (fetchMatches) await fetchMatches();
        if (goBack) goBack();
      } else {
        Toast.fire({
          icon: "error",
          title: `Error.`,
        });
      }
    } catch (err) {
      console.error("End match error:", err);
      Toast.fire({
        icon: "error",
        title: `Error.`,
      });
    } finally {
      setEnding(false);
    }
  };

  if (!match) return <div className="p-6 text-center">Match not found</div>;

  // nice helper to get player object
  const getPlayerObj = (entry) => {
    // entry may be an id string or an object with _id
    const id =
      typeof entry === "string" ? entry : entry?._id ? String(entry._id) : null;
    return id ? playerById[id] || { _id: id, name: id, avatar: "" } : null;
  };

  return (
    <div className="flex flex-col h-[70%] bg-gray-100">
      <div className="flex items-center justify-between p-4 top-15 bg-white shadow-md z-10 sticky ">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {match.teamAName} vs {match.teamBName}
          </h2>
          {/* <p className="text-sm text-gray-500">
          {match.matchDate} — {match.matchTime} ({match.matchDuration} min)
        </p> */}
          <p className="mt-1 text-sm text-gray-700">
            <strong>Score:</strong> {teamTotals.teamAScore} —{" "}
            {teamTotals.teamBScore}
          </p>
        </div>

        <div className="flex gap-2">
          {/* <button
          onClick={goBack}
          className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 shadow"
        >
          ← Close
        </button> */}
          <button
            onClick={handleSave}
            disabled={saving}
            className={`px-3 py-1 rounded text-white shadow ${
              saving ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {saving ? "Saving..." : "Save Match"}
          </button>
          <button
            onClick={handleEnd}
            disabled={ending}
            className={`px-3 py-1 rounded text-white shadow ${
              ending ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {ending ? "Ending..." : "End Match"}
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Team A */}
          <div className="bg-white shadow-gray-300 rounded-lg shadow-md p-4 ">
            <h4 className="font-semibold text-lg mb-3 bg-gradient-to-r text-center rounded-2xl shadow-md shadow-blue-300 from-blue-600 to-purple-600 text-white">
              {match.teamAName} — Players
            </h4>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {(match.teamA || []).map((p) => {
                const player = getPlayerObj(p);
                const id = player?._id
                  ? String(player._id)
                  : typeof p === "string"
                  ? p
                  : "";
                const stats = playerStats[id] || {
                  goals: 0,
                  fouls: 0,
                  assists: 0,
                };
                return (
                  <div
                    key={id}
                    className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded transition"
                  >
                    <img
                      src={player?.avatar || "https://via.placeholder.com/48"}
                      alt={player?.name || id}
                      className="w-12 h-12 rounded-full object-cover border border-gray-300"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {player?.name || id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {player?.category || "—"}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Goals: {stats.goals} | Fouls: {stats.fouls} | Assists:{" "}
                        {stats.assists}
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handlePlayerAction(id, "goals")}
                        className="px-2 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700"
                      >
                        +Goal
                      </button>
                      <button
                        onClick={() => handlePlayerAction(id, "assists")}
                        className="px-2 py-1 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
                      >
                        +Assist
                      </button>
                      <button
                        onClick={() => handlePlayerAction(id, "fouls")}
                        className="px-2 py-1 text-sm rounded bg-yellow-500 text-white hover:bg-yellow-600"
                      >
                        +Foul
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Team B */}
          <div className="bg-white shadow-gray-300 rounded-lg shadow-md p-4">
            <h4 className="font-semibold text-lg mb-3 bg-gradient-to-r  rounded-2xl shadow-md text-center  shadow-blue-300 from-blue-600 to-purple-600 text-white">
              {match.teamBName} — Players
            </h4>
            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
              {(match.teamB || []).map((p) => {
                const player = getPlayerObj(p);
                const id = player?._id
                  ? String(player._id)
                  : typeof p === "string"
                  ? p
                  : "";
                const stats = playerStats[id] || {
                  goals: 0,
                  fouls: 0,
                  assists: 0,
                };
                return (
                  <div
                    key={id}
                    className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded transition"
                  >
                    <img
                      src={player?.avatar || "https://via.placeholder.com/48"}
                      alt={player?.name || id}
                      className="w-12 h-12 rounded-full object-cover border border-gray-300"
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">
                        {player?.name || id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {player?.category || "—"}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        Goals: {stats.goals} | Fouls: {stats.fouls} | Assists:{" "}
                        {stats.assists}
                      </div>
                    </div>

                    <div className="flex gap-1">
                      <button
                        onClick={() => handlePlayerAction(id, "goals")}
                        className="px-2 py-1 text-sm rounded bg-green-600 text-white shadow-md shadow-gray-300 hover:bg-green-700"
                      >
                        +Goal
                      </button>
                      <button
                        onClick={() => handlePlayerAction(id, "assists")}
                        className="px-2 py-1 text-sm rounded bg-blue-600 text-white shadow-md shadow-gray-300 hover:bg-blue-700"
                      >
                        +Assist
                      </button>
                      <button
                        onClick={() => handlePlayerAction(id, "fouls")}
                        className="px-2 py-1 text-sm rounded bg-yellow-500 text-white shadow-md shadow-gray-300 hover:bg-yellow-600"
                      >
                        +Foul
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Summary bar */}
      <div className="bg-gradient-to-r   shadow-md shadow-blue-300 from-blue-600 to-purple-600 text-white shadow-inner p-4 border-t sticky bottom-0 z-10">
        <div className="flex justify-between text-sm font-medium ">
          <div>
            <strong>{match.teamAName}</strong> — Score: {teamTotals.teamAScore}{" "}
            | Goals: {teamTotals.teamAGoals} | Fouls: {teamTotals.teamAFouls}
          </div>
          <div>
            <strong>{match.teamBName}</strong> — Score: {teamTotals.teamBScore}{" "}
            | Goals: {teamTotals.teamBGoals} | Fouls: {teamTotals.teamBFouls}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchManagement;
