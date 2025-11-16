import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";

const Recent = () => {
  const { recent, players } = useContext(AuthContext);
  const [selectedMatch, setSelectedMatch] = useState(null);

  if (!recent) return <div className="text-center py-10 text-lg">Loading...</div>;

  // Helper to get player object
  const getPlayerObj = (id) => {
    return players.find((p) => String(p._id) === String(id)) || { _id: id, name: id, avatar: "" };
  };

  const getResult = (match) => {
    const { stats } = match || {};
    if (!stats) return "—";
    const teamAScore = stats.teamAScore || 0;
    const teamBScore = stats.teamBScore || 0;

    if (teamAScore > teamBScore) return `${match.teamAName} Won`;
    if (teamBScore > teamAScore) return `${match.teamBName} Won`;
    return "Draw";
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-2">
      {recent.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No recent matches.</p>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {recent.map((match) => (
            <div
              key={match._id}
              className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-center text-xl font-semibold text-gray-900 mb-2">
                  <span className="text-blue-600">{match.teamAName}</span>{" "}
                  <span className="text-gray-500">vs</span>{" "}
                  <span className="text-red-600">{match.teamBName}</span>
                </h3>

                <p className="text-center text-sm font-medium mb-3 text-gray-700">
                  Result: <span className="text-indigo-600">{getResult(match)}</span>
                </p>

                <div className="space-y-2 text-sm text-gray-700">
                  <p>
                    <span className="font-medium text-gray-900">📅 Date:</span>{" "}
                    {match.matchDate}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">⏰ Time:</span>{" "}
                    {match.matchTime}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">⏱ Duration:</span>{" "}
                    {match.matchDuration} mins
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">👥 Team Size:</span>{" "}
                    {match.teamSize}
                  </p>
                </div>
              </div>

              <div className="mt-5 text-center flex justify-center gap-3">
                <button
                  onClick={() => setSelectedMatch(match)}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold px-4 py-2 rounded-lg shadow hover:scale-105 transition-transform duration-200"
                >
                  View Summary
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    
   {selectedMatch && (
  <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl max-w-3xl w-full p-6 relative overflow-y-auto max-h-[80vh]">
      <button
        onClick={() => setSelectedMatch(null)}
        className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 font-bold"
      >
        ✕
      </button>

      <h2 className="text-xl font-bold mb-4 text-center">
        {selectedMatch.teamAName} vs {selectedMatch.teamBName}
      </h2>

      <p className="text-center mb-4 font-medium">
        Result: <span className="text-indigo-600">{getResult(selectedMatch)}</span>
      </p>

      <div className="grid md:grid-cols-2 gap-6">
  
        <div className="border p-4 rounded-lg">
          <h4 className="font-semibold mb-3 text-center">{selectedMatch.teamAName}</h4>
          <div className="text-sm space-y-1">
            <p>Goals Scored: {selectedMatch.stats?.teamAGoals ?? 0}</p>
            <p>Fouls: {selectedMatch.stats?.teamAFouls ?? 0}</p>
            <p>Team Score: {selectedMatch.stats?.teamAScore ?? 0}</p>
          </div>
        </div>

        <div className="border p-4 rounded-lg">
          <h4 className="font-semibold mb-3 text-center">{selectedMatch.teamBName}</h4>
          <div className="text-sm space-y-1">
            <p>Goals Scored: {selectedMatch.stats?.teamBGoals ?? 0}</p>
            <p>Fouls: {selectedMatch.stats?.teamBFouls ?? 0}</p>
            <p>Team Score: {selectedMatch.stats?.teamBScore ?? 0}</p>
          </div>
        </div>
      </div>

      {/* Match info */}
      <div className="mt-6 text-sm text-gray-700 space-y-1">
        <p>Match Date: {selectedMatch.matchDate}</p>
        <p>Match Time: {selectedMatch.matchTime}</p>
        <p>Duration: {selectedMatch.matchDuration} mins</p>
        <p>Team Size: {selectedMatch.teamSize}</p>
        <p>Status: {selectedMatch.isLive ? "Live" : selectedMatch.isFinished ? "Finished" : "Upcoming"}</p>
      </div>
    </div>
  </div>
)}
    </div>
  );
};

export default Recent;