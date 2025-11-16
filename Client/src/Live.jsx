import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import image from "./image copy.png";

const Live = () => {
  const { live } = useContext(AuthContext);

  if (!live) return <div className="text-center py-10 text-lg">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-4">
      {live.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No live matches right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {live.map((match) => (
            <div
              key={match._id}
              className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 flex flex-col relative"
            >
              {/* Live Pulse */}
              <span className="absolute top-4 right-4 w-10 h-10">
                <span className="absolute inline-flex w-full h-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
                <img
                  src={image}
                  className="relative w-10 h-10 rounded-full border-2 border-white"
                  alt="Live"
                />
              </span>

              {/* Title */}
              <h3 className="text-center text-2xl font-bold text-gray-900 mb-3">
                <span className="text-blue-600">{match.teamAName}</span>{" "}
                <span className="text-gray-500">vs</span>{" "}
                <span className="text-red-600">{match.teamBName}</span>
              </h3>

              {/* Score */}
              <div className="text-center text-3xl font-extrabold text-gray-900 mb-3">
                {match?.stats?.teamAScore ?? 0}{" "}
                <span className="text-gray-500">—</span>{" "}
                {match?.stats?.teamBScore ?? 0}
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 bg-gray-100 p-4 rounded-xl">
                <div>
                  <h4 className="font-semibold text-blue-600">{match.teamAName}</h4>
                  <p>Goals: {match?.stats?.teamAGoals ?? 0}</p>
                  <p>Fouls: {match?.stats?.teamAFouls ?? 0}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-red-600">{match.teamBName}</h4>
                  <p>Goals: {match?.stats?.teamBGoals ?? 0}</p>
                  <p>Fouls: {match?.stats?.teamBFouls ?? 0}</p>
                </div>
              </div>

              {/* Extra Info */}
              <div className="mt-4 space-y-1 text-sm text-gray-600">
                <p>📅 Date: {match.matchDate}</p>
                <p>⏰ Time: {match.matchTime}</p>
                <p>⏱ Duration: {match.matchDuration} mins</p>
                <p>👥 Team Size: {match.teamSize}</p>
              </div>

              <div className="mt-6 text-center">
                <button className="bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold px-5 py-2 rounded-lg shadow-md transform transition-all duration-300 animate-pulse hover:scale-105">
                  Watch Now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Live;