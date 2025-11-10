import React from "react";

const PlayerCard = ({ player, updateStat }) => {
  const { _id, name, category, avatar, stats } = player;

  const totalScore = stats.goals * 4 + stats.assists * 3 - stats.penalties * 2 - stats.fouls;
  const matchesPlayed = stats.wins + stats.losses;
  const winRate = matchesPlayed === 0 ? 0 : ((stats.wins / matchesPlayed) * 100).toFixed(1);

  return (
    <div className="bg-gradient-to-br from-red-100 via-yellow-50 to-green-100 p-4 rounded-2xl shadow-md flex flex-col items-center gap-2 hover:shadow-lg transition">
      <img src={avatar || "/default-avatar.png"} alt={name} className="w-24 h-24 rounded-full object-cover mb-2" />
      <h3 className="font-bold text-gray-800">{name}</h3>
      <p className="text-sm text-gray-500">{category}</p>

      <div className="flex flex-col gap-2 w-full mt-2">
        {["goals", "assists", "penalties", "fouls", "wins", "losses"].map((stat) => (
          <div key={stat} className="flex justify-between items-center">
            <span className="capitalize">
              {stat === "wins" ? "Win" : stat === "losses" ? "Lose" : stat}: {stats[stat]}
            </span>
            <button
              onClick={() => updateStat(_id, stat)}
              className={`px-2 py-1 rounded-lg text-white text-sm ${
                stat === "goals"
                  ? "bg-green-500"
                  : stat === "assists"
                  ? "bg-blue-500"
                  : stat === "penalties"
                  ? "bg-red-500"
                  : stat === "fouls"
                  ? "bg-yellow-500"
                  : stat === "wins"
                  ? "bg-indigo-500"
                  : "bg-gray-500"
              }`}
            >
              +1
            </button>
          </div>
        ))}
        <div className="mt-2 text-center font-bold text-gray-800">Total Score: {totalScore}</div>
        <div className="text-sm text-gray-600">Matches: {matchesPlayed} | Win Rate: {winRate}%</div>
      </div>
    </div>
  );
};

export default PlayerCard;