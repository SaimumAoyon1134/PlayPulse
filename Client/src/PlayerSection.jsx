import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "./Loading";

const PlayerSection = () => {
  const [players, setPlayers] = useState([]);
  const [filteredPlayers, setFilteredPlayers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchText, setSearchText] = useState("");
  const [sortType, setSortType] = useState("");

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/players");
      const playersData = res.data.map((player) => {
        const totalScore =
          player.stats.goals * 4 +
          player.stats.assists * 3 -
          player.stats.penalties * 2 -
          player.stats.fouls;
        return { ...player, totalScore };
      });

      setPlayers(playersData);
      setFilteredPlayers(playersData);
    } catch (err) {
      console.error("Error fetching players:", err);
    } finally {
      setLoading(false);
    }
  };

  
  const handleSearch = (value) => {
    setSearchText(value);
    const filtered = players.filter((player) =>
      player.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPlayers(filtered);
  };


  const handleSort = (type) => {
    setSortType(type);

    const sorted = [...filteredPlayers].sort((a, b) => {
      if (type === "goals") return b.stats.goals - a.stats.goals;
      if (type === "assists") return b.stats.assists - a.stats.assists;
      if (type === "score") return b.totalScore - a.totalScore;
      return 0;
    });

    setFilteredPlayers(sorted);
  };

  return (
    <div className="p-6">
     

      {/* SEARCH + SORT SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        {/* Search */}
        <input
          type="text"
          value={searchText}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder="Search player..."
          className="px-4 py-2 border rounded-xl shadow-sm w-full md:w-1/3 focus:ring-2 focus:ring-blue-400"
        />

        {/* Sort */}
        <select
          className="px-4 py-2 border rounded-xl shadow-sm w-full md:w-1/4 focus:ring-2 focus:ring-green-400"
          value={sortType}
          onChange={(e) => handleSort(e.target.value)}
        >
          <option value="">Sort By</option>
          <option value="goals">Goals</option>
          <option value="assists">Assists</option>
          <option value="score">Total Score</option>
        </select>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="flex justify-center items-center h-40">
          <Loading />
        </div>
      )}

      {/* TABLE */}
      {!loading && filteredPlayers.length > 0 && (
        <div className="overflow-x-auto shadow-lg rounded-2xl">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <tr>
                <th className="p-4">Avatar</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Goals</th>
                <th className="p-4">Assists</th>
                <th className="p-4">Penalties</th>
                <th className="p-4">Fouls</th>
                <th className="p-4">Total Score</th>
              </tr>
            </thead>

            <tbody>
              {filteredPlayers.map((player) => (
                <tr
                  key={player._id}
                  className="hover:bg-gray-100 transition border-b"
                >
                  <td className="p-3">
                    <img
                      src={player.avatar || "/default-avatar.png"}
                      alt={player.name}
                      className="w-12 h-12 rounded-full border"
                    />
                  </td>
                  <td className="p-3 font-medium text-gray-800">{player.name}</td>
                  <td className="p-3 text-gray-600">{player.category}</td>
                  <td className="p-3 text-green-600 font-bold">
                    {player.stats.goals}
                  </td>
                  <td className="p-3 text-blue-600 font-bold">
                    {player.stats.assists}
                  </td>
                  <td className="p-3 text-red-600 font-bold">
                    {player.stats.penalties}
                  </td>
                  <td className="p-3 text-yellow-600 font-bold">
                    {player.stats.fouls}
                  </td>
                  <td className="p-3 font-bold text-gray-900">
                    {player.totalScore}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* NO RESULTS */}
      {!loading && filteredPlayers.length === 0 && (
        <p className="text-center text-gray-500 text-lg py-10">
          No matching players found.
        </p>
      )}
    </div>
  );
};

export default PlayerSection;