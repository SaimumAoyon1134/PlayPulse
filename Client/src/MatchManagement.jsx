import React, { useEffect, useState } from "react";


const MatchManagement = ({ match, goBack }) => {
  const [stats, setStats] = useState({
    teamAScore: 0,
    teamBScore: 0,
    teamAGoals: 0,
    teamBGoals: 0,
    teamAFouls: 0,
    teamBFouls: 0,
  });

  const [saving, setSaving] = useState(false);
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    
    setStats({
      teamAScore: 0,
      teamBScore: 0,
      teamAGoals: 0,
      teamBGoals: 0,
      teamAFouls: 0,
      teamBFouls: 0,
    });
  }, [match]);

  const handleChange = (field, value) => {
    setStats((s) => ({ ...s, [field]: Number(value) }));
  };


  const handleSaveStats = async () => {
    try {
      setSaving(true);

      const res = await fetch(`http://localhost:3000/matches/${match._id}/stats`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stats }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert("Failed to save stats.");
        console.error(data);
      } else {
        alert("Stats saved!");
      }
    } catch (err) {
      console.error("Save stats error:", err);
      alert("Error saving stats.");
    } finally {
      setSaving(false);
    }
  };

 
  const handleEndMatch = async () => {
    try {
      setEnding(true);

      const res = await fetch(`http://localhost:3000/matches/${match._id}/end`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (data.success) {
        alert("Match ended.");
        goBack(); // return to Live list
      } else {
        alert("Failed to end match.");
        console.error(data);
      }
    } catch (err) {
      console.error("End match error:", err);
      alert("Error ending match.");
    } finally {
      setEnding(false);
    }
  };

  const formatPlayers = (arr) => {
    if (!Array.isArray(arr)) return "";
    return arr.join(", ");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
     
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold">
            Managing: {match.teamAName} vs {match.teamBName}
          </h2>
          <p className="text-sm text-gray-600">
            {match.matchDate} — {match.matchTime} ({match.matchDuration} min)
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={goBack}
            className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
          >
            ← Back
          </button>

          <button
            onClick={handleSaveStats}
            disabled={saving}
            className={`px-3 py-1 rounded text-white ${
              saving ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {saving ? "Saving..." : "Save Stats"}
          </button>

          <button
            onClick={handleEndMatch}
            disabled={ending}
            className={`px-3 py-1 rounded text-white ${
              ending ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
            }`}
          >
            {ending ? "Ending..." : "End Match"}
          </button>
        </div>
      </div>

    
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

    
        <div className="border p-4 rounded">
          <h4 className="font-semibold mb-2">{match.teamAName} — Players</h4>
          <p className="text-sm text-gray-700 mb-3">
            {formatPlayers(match.teamA)}
          </p>

          <label className="block mb-2">
            Score:
            <input
              type="number"
              value={stats.teamAScore}
              onChange={(e) => handleChange("teamAScore", e.target.value)}
              className="border ml-2 p-1 w-24"
            />
          </label>

          <label className="block mb-2">
            Goals:
            <input
              type="number"
              value={stats.teamAGoals}
              onChange={(e) => handleChange("teamAGoals", e.target.value)}
              className="border ml-2 p-1 w-24"
            />
          </label>

          <label className="block mb-2">
            Fouls:
            <input
              type="number"
              value={stats.teamAFouls}
              onChange={(e) => handleChange("teamAFouls", e.target.value)}
              className="border ml-2 p-1 w-24"
            />
          </label>
        </div>

        {/* TEAM B */}
        <div className="border p-4 rounded">
          <h4 className="font-semibold mb-2">{match.teamBName} — Players</h4>
          <p className="text-sm text-gray-700 mb-3">
            {formatPlayers(match.teamB)}
          </p>

          <label className="block mb-2">
            Score:
            <input
              type="number"
              value={stats.teamBScore}
              onChange={(e) => handleChange("teamBScore", e.target.value)}
              className="border ml-2 p-1 w-24"
            />
          </label>

          <label className="block mb-2">
            Goals:
            <input
              type="number"
              value={stats.teamBGoals}
              onChange={(e) => handleChange("teamBGoals", e.target.value)}
              className="border ml-2 p-1 w-24"
            />
          </label>

          <label className="block mb-2">
            Fouls:
            <input
              type="number"
              value={stats.teamBFouls}
              onChange={(e) => handleChange("teamBFouls", e.target.value)}
              className="border ml-2 p-1 w-24"
            />
          </label>
        </div>
      </div>

      {/* SUMMARY BOX */}
      <div className="mt-6 bg-gray-50 p-3 rounded text-sm">
        <strong>{match.teamAName}</strong> — Score: {stats.teamAScore} | Goals:{" "}
        {stats.teamAGoals} | Fouls: {stats.teamAFouls}
        <br />
        <strong>{match.teamBName}</strong> — Score: {stats.teamBScore} | Goals:{" "}
        {stats.teamBGoals} | Fouls: {stats.teamBFouls}
      </div>
    </div>
  );
};

export default MatchManagement;