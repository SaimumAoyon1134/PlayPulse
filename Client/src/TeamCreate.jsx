// src/components/CreateMatch.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Loading from "./Loading";

const CreateMatch = () => {
  const [players, setPlayers] = useState([]);
  const [search, setSearch] = useState("");
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [teamAName, setTeamAName] = useState("Team A");
  const [teamBName, setTeamBName] = useState("Team B");
  const [teamSize, setTeamSize] = useState(5);
  const [loading, setLoading] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loadingp, setLoadingp] = useState(true);

  // ✅ Added these three new states
  const [matchDate, setMatchDate] = useState("");
  const [matchTime, setMatchTime] = useState("");
  const [matchDuration, setMatchDuration] = useState(90);

  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    },
  });
  // Fetch all players
  useEffect(() => {
    const fetchPlayers = async () => {
      setLoadingp(true);
      try {
        const res = await axios.get(
          "https://playpulse-production.up.railway.app/players"
        );
        setPlayers(res.data);
        setLoadingp(false);
      } catch (err) {
        console.error("Failed to fetch players:", err);
        Toast.fire({
          icon: "error",
          title: "Failed to reload in database! Please try again.",
        });
      }
    };
    fetchPlayers();
  }, []);

  const availablePlayers = players.filter(
    (p) =>
      !teamA.some((t) => t._id === p._id) &&
      !teamB.some((t) => t._id === p._id) &&
      p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addPlayerToTeam = (player, team) => {
    if (team === "A") {
      if (teamA.length >= teamSize)
        return Toast.fire({
          icon: "error",
          title: `Team A can have only ${teamSize} players`,
        });
      setTeamA([...teamA, player]);
    } else {
      if (teamB.length >= teamSize)
        return Toast.fire({
          icon: "error",
          title: `Team B can have only ${teamSize} players`,
        });
      setTeamB([...teamB, player]);
    }
    setModalOpen(false);
    setSelectedPlayer(null);
  };

  const removePlayerFromTeam = (player, team) => {
    if (team === "A") setTeamA(teamA.filter((p) => p._id !== player._id));
    else setTeamB(teamB.filter((p) => p._id !== player._id));
  };

  const handleCreateMatch = async () => {
    if (!teamAName.trim() || !teamBName.trim())
      return Toast.fire({
        icon: "error",
        title: `Please enter names for both teams`,
      });
    if (teamA.length !== teamSize || teamB.length !== teamSize)
      return Toast.fire({
        icon: "error",
        title: `Both teams must have exactly ${teamSize} players`,
      });

    if (!matchDate || !matchTime)
      return Toast.fire({
        icon: "error",
        title: `Please select match date and time`,
      });

    try {
      setLoading(true);
      await axios.post("https://playpulse-production.up.railway.app/matches", {
        teamA: teamA.map((p) => p._id),
        teamB: teamB.map((p) => p._id),
        teamAName: teamAName.trim(),
        teamBName: teamBName.trim(),
        teamSize,
        matchDate,
        matchTime,
        matchDuration,
        createdAt: new Date(),
      });
      Swal.fire({
        title: "Match Create Successfully!!!!",
        icon: "success",
        draggable: true,
      });
      setTeamA([]);
      setTeamB([]);
      setTeamAName("Team A");
      setTeamBName("Team B");
      setMatchDate("");
      setMatchTime("");
      setMatchDuration(90);
    } catch (err) {
      console.error("Failed to create match:", err);
      alert("Failed to create match");
    } finally {
      setLoading(false);
    }
  };

  const PlayerCard = ({ player }) => (
    <div
      className="bg-white p-2 mb-2 rounded-2xl shadow flex items-center gap-2 cursor-pointer hover:bg-gray-100"
      onClick={() => {
        setSelectedPlayer(player);
        setModalOpen(true);
      }}
    >
      {player.avatar && (
        <img
          src={player.avatar}
          alt={player.name}
          className="w-10 h-10 rounded-full object-cover border"
        />
      )}
      <span>{player.name}</span>
    </div>
  );

  const TeamPlayerCard = ({ player, removeFromTeam }) => (
    <div className="bg-white p-2 mb-2 rounded shadow flex items-center justify-between cursor-pointer hover:bg-gray-100">
      <div className="flex items-center gap-2">
        {player.avatar && (
          <img
            src={player.avatar}
            alt={player.name}
            className="w-10 h-10 rounded-full object-cover border"
          />
        )}
        <span>{player.name}</span>
      </div>
      <button onClick={removeFromTeam} className="text-red-500 font-bold">
        ❌
      </button>
    </div>
  );

  return (
    <div className="max-w-6xl text-black  mx-auto p-4 sm:p-6  min-h-screen">
      {/* <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
        Create Match
      </h2> */}

      <div className="flex flex-wrap justify-between items-center mb-4 gap-4">
        <div className="flex items-center gap-2 sm:gap-4">
          <label className="font-semibold">Team Size:</label>
          <input
            type="number"
            min={1}
            max={11}
            value={teamSize}
            onChange={(e) => setTeamSize(parseInt(e.target.value))}
            className="shadow-md shadow-gray-400 rounded px-2 py-1 w-20 focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        </div>

        <input
          type="text"
          placeholder="Team A Name"
          value={teamAName}
          onChange={(e) => setTeamAName(e.target.value)}
          className="shadow-md shadow-gray-400 rounded px-2 py-1 w-full sm:w-1/5 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Team B Name"
          value={teamBName}
          onChange={(e) => setTeamBName(e.target.value)}
          className="shadow-md shadow-gray-400 rounded px-2 py-1 w-full sm:w-1/5 focus:outline-none focus:ring-2 focus:ring-red-400"
        />

        {/* Date & Time Inputs */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch gap-4 w-full">
          {/* each child (date, time, duration input) */}
          <div className="flex-1">
            <label className="text-sm font-semibold mb-1 block">
              Match Date
            </label>
            <input
              type="date"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              className="shadow-md shadow-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="flex-1">
            <label className="text-sm font-semibold mb-1 block">
              Match Time
            </label>
            <input
              type="time"
              value={matchTime}
              onChange={(e) => setMatchTime(e.target.value)}//specifilly set the time to play
              className="shadow-md shadow-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>

          <div className="flex-1">
            <label className="text-sm font-semibold mb-1 block">
              Duration (mins)
            </label>
            <input
              type="number"
              min={10}
              max={300}
              value={matchDuration}
              onChange={(e) => setMatchDuration(parseInt(e.target.value))}
              className="shadow-md shadow-gray-400 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-green-400"
            />
          </div>
        </div>
      </div>

      {/* Search & Create */}
      <div className="flex flex-col md:flex-row justify-center gap-3 mb-3 text-center mt-6">
        <input
          type="text"
          placeholder="Search players..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="shadow-md shadow-gray-400 rounded px-3 py-2 w-full sm:w-2/3 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        <button
          onClick={handleCreateMatch}
          disabled={loading}
          className="bg-green-600 shadow-md shadow-gray-400 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50 hover:scale-[1.02]"
        >
          {loading ? "Creating..." : "Create Match"}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-50 p-4 rounded shadow min-h-[400px] max-h-[500px] overflow-y-auto">
          <h3 className="font-semibold p-2 bg-gradient-to-r sticky -top-4 rounded-2xl shadow-md shadow-blue-300 from-blue-600 to-purple-600 text-white">
            Available Players
          </h3>
          {loadingp ? (
            <Loading />
          ) : availablePlayers.length === 0 ? (
            <p className="text-gray-400">No players available</p>
          ) : (
            availablePlayers.map((p) => <PlayerCard key={p._id} player={p} />)
          )}
        </div>

        {/* Team A */}
        <div className="bg-gray-50 p-4 rounded shadow min-h-[400px]">
          <h3 className="font-semibold p-2 bg-gradient-to-r sticky -top-4 rounded-2xl shadow-md shadow-blue-300 from-blue-600 to-purple-600 text-white">
            {teamAName} ({teamA.length}/{teamSize})
          </h3>
          {teamA.map((p) => (
            <TeamPlayerCard
              key={p._id}
              player={p}
              removeFromTeam={() => removePlayerFromTeam(p, "A")}
            />
          ))}
        </div>

        {/* Team B */}
        <div className="bg-gray-50 p-4 rounded shadow min-h-[400px]">
          <h3 className="font-semibold p-2 bg-gradient-to-r sticky -top-4 rounded-2xl shadow-md shadow-blue-300 from-blue-600 to-purple-600 text-white">
            {teamBName} ({teamB.length}/{teamSize})
          </h3>
          {teamB.map((p) => (
            <TeamPlayerCard
              key={p._id}
              player={p}
              removeFromTeam={() => removePlayerFromTeam(p, "B")}
            />
          ))}
        </div>
      </div>

      {/* Modal for adding player to team */}
      {modalOpen && selectedPlayer && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-80 sm:w-96 p-6 transform transition-transform scale-95 animate-scale-in">
            <div className="flex flex-col items-center">
              {selectedPlayer.avatar && (
                <img
                  src={selectedPlayer.avatar}
                  alt={selectedPlayer.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-green-200 mb-4 shadow-lg"
                />
              )}
              <h3 className="text-2xl font-bold mb-2 text-gray-800">
                {selectedPlayer.name}
              </h3>
              <p className="text-gray-500 mb-6 text-center">
                Choose a team to add this player
              </p>
              <div className="flex gap-4 w-full">
                <button
                  onClick={() => addPlayerToTeam(selectedPlayer, "A")}
                  className="flex-1 bg-gradient-to-r  rounded-2xl shadow-md shadow-blue-300 from-blue-600 to-purple-600 text-white font-semibold py-2 rounded-xl shadow hover:from-blue-500 hover:to-blue-700 transition-all"
                >
                  Add to {teamAName}
                </button>
                <button
                  onClick={() => addPlayerToTeam(selectedPlayer, "B")}
                  className="flex-1 bg-gradient-to-r  rounded-2xl shadow-md shadow-blue-300 from-blue-600 to-purple-600 text-white font-semibold py-2 rounded-xl shadow hover:from-red-500 hover:to-red-700 transition-all"
                >
                  Add to {teamBName}
                </button>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="mt-6 text-red-500  hover:text-red-800 font-medium transition-colors"
              >
                X Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateMatch;
