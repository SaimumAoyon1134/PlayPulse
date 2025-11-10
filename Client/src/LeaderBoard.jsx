import React from "react";

const Leaderboard = ({ players }) => {
  const rankedPlayers = [...players].sort((a, b) => {
    const matchesA = a.stats.wins + a.stats.losses || 1;
    const matchesB = b.stats.wins + b.stats.losses || 1;

    const winRateA = (a.stats.wins / matchesA) * 100;
    const winRateB = (b.stats.wins / matchesB) * 100;

    if (winRateB !== winRateA) return winRateB - winRateA;

    const scoreA = a.stats.goals * 4 + a.stats.assists * 3 - a.stats.penalties * 2 - a.stats.fouls;
    const scoreB = b.stats.goals * 4 + b.stats.assists * 3 - b.stats.penalties * 2 - b.stats.fouls;

    return scoreB - scoreA;
  });

  return (
    <div className="mt-6 bg-white p-4 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Leaderboard</h2>
      {rankedPlayers.map((player, idx) => {
        const totalScore = player.stats.goals * 4 + player.stats.assists * 3 - player.stats.penalties * 2 - player.stats.fouls;
        const matchesPlayed = player.stats.wins + player.stats.losses;
        const winRate = matchesPlayed === 0 ? 0 : ((player.stats.wins / matchesPlayed) * 100).toFixed(1);

        return (
          <div key={player._id} className="flex justify-between items-center border-b py-2 text-gray-700">
            <span>
              #{idx + 1} {player.name} ({player.category})
            </span>
            <span>
              Score: {totalScore} | WinRate: {winRate}% | Matches: {matchesPlayed}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default Leaderboard;