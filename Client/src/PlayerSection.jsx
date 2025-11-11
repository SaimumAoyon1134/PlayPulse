import React, { useState, useEffect } from "react";
import axios from "axios";
import AddPlayerModal from "./AddPlayerModal";

const PlayerSection = () => {
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/players");
      setPlayers(res.data);
    } catch (err) {
      console.error("Error fetching players:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatColor = (stat) => {
    switch (stat) {
      case "Goals":
        return "text-green-500";
      case "Assists":
        return "text-blue-500";
      case "Penalties":
        return "text-red-500";
      case "Fouls":
        return "text-yellow-500";
      case "Wins":
        return "text-indigo-500";
      case "Losses":
        return "text-gray-500";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <h2 className="text-3xl w-full col-span-full bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white mb-5 font-semibold py-2  text-center">
        Player's Info....
      </h2>
      {/* Add Player Button */}
      {/* <button
        className=" bg-white text-black py-2 rounded-lg font-bold hover:bg-gradient-to-br from-red-100 via-yellow-50 to-green-100 transition"
        onClick={() => setShowAddModal(true)}
      >
        + Add Player
      </button> */}

      {/* Loading Spinner */}
      {loading && (
        <div className="col-span-full flex justify-center items-center py-10">
          <div className="loader border-4 border-t-4 border-white border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}

      {/* Player Cards */}
      {!loading &&
        players.map((player) => {
          const { _id, name, category, avatar, stats } = player;
          const totalScore =
            stats.goals * 4 +
            stats.assists * 3 -
            stats.penalties * 2 -
            stats.fouls;
          const matchesPlayed = stats.wins + stats.losses;
          const winRate =
            matchesPlayed === 0
              ? 0
              : ((stats.wins / matchesPlayed) * 100).toFixed(1);

          return (
            <div
              key={_id}
              className="bg-gradient-to-br from-red-100 via-yellow-50 to-green-100 p-4 rounded-3xl shadow-lg flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
              onClick={() => setSelectedPlayer(player)}
            >
              <img
                src={avatar || "/default-avatar.png"}
                alt={name}
                className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md mb-2"
              />
              <h3 className="font-extrabold text-gray-800 text-lg">{name}</h3>
              <p className="text-sm font-semibold text-gray-600 mb-2">{category}</p>

              <div className="flex flex-wrap justify-center gap-3 mt-2">
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
                  Goals: {stats.goals}
                </span>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-medium">
                  Assists: {stats.assists}
                </span>
                <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full font-medium">
                  Penalties: {stats.penalties}
                </span>
                <span className="bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full font-medium">
                  Fouls: {stats.fouls}
                </span>
                <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full font-medium">
                  Wins: {stats.wins}
                </span>
                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium">
                  Losses: {stats.losses}
                </span>
              </div>

              <div className="mt-2 text-center font-bold text-gray-800">
                Total Score: {totalScore}
              </div>
              <div className="text-sm text-gray-600">
                Matches: {matchesPlayed} | Win Rate: {winRate}%
              </div>
            </div>
          );
        })}

      {/* Player Detail Modal */}
      {selectedPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-red-50 via-yellow-50 to-green-50 p-6 rounded-3xl shadow-2xl w-96 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl font-bold"
              onClick={() => setSelectedPlayer(null)}
            >
              ✕
            </button>
            <img
              src={selectedPlayer.avatar || "/default-avatar.png"}
              alt={selectedPlayer.name}
              className="w-32 h-32 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg"
            />
            <h2 className="text-2xl font-extrabold text-center mb-1">
              {selectedPlayer.name}
            </h2>
            <p className="text-center text-gray-600 mb-4 font-semibold">
              {selectedPlayer.category}
            </p>

            <div className="space-y-2 text-gray-700 text-sm">
              {Object.entries(selectedPlayer.stats).map(([key, value]) => (
                <p
                  key={key}
                  className={`font-semibold ${getStatColor(
                    key.charAt(0).toUpperCase() + key.slice(1)
                  )}`}
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                </p>
              ))}
            </div>

            <button
              className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-xl font-bold transition"
              onClick={() => setSelectedPlayer(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Add Player Modal */}
      {/* <AddPlayerModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onPlayerAdded={(player) => setPlayers([...players, player])}
      /> */}

      {/* Loader Style */}
      <style>
        {`
          .loader {
            border-top-color: transparent;
            border-radius: 50%;
            width: 3rem;
            height: 3rem;
            border-width: 0.4rem;
            border-style: solid;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default PlayerSection;