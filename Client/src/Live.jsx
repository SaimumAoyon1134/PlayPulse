import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import image from "./image copy.png";

const Live = () => {
  const { live } = useContext(AuthContext);

  if (!live) return <div className="text-center py-10 text-lg">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto px-6 py-2">
      {live.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">
          No live matches right now.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {live.map((match) => (
            <div
              key={match._id}
              className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6 flex flex-col justify-between relative"
            >
              <span className="absolute top-4 right-4 w-10 h-10">
                <span className="absolute inline-flex w-full h-full rounded-full bg-red-500 opacity-75 animate-ping"></span>
                <img
                  src={image}
                  className="relative w-10 h-10 rounded-full border-2 border-white"
                  alt="Live Player"
                />
              </span>

              <div>
                <h3 className="text-center text-xl font-semibold text-gray-900 mb-3">
                  <span className="text-blue-600">{match.teamAName}</span>{" "}
                  <span className="text-gray-500">vs</span>{" "}
                  <span className="text-red-600">{match.teamBName}</span>
                </h3>

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
                    <span className="font-medium text-gray-900">
                      ⏱ Duration:
                    </span>{" "}
                    {match.matchDuration} mins
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">
                      👥 Team Size:
                    </span>{" "}
                    {match.teamSize}
                  </p>
                </div>
              </div>

              <div className="mt-5 text-center">
                <button className="bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold px-4 py-2 rounded-lg shadow-2xl shadow-gray-300 transform transition-all duration-300 animate-pulse cursor-pointer hover:scale-105">
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
