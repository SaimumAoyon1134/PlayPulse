import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminMatchTable = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await axios.get(
          "https://playpulse-production.up.railway.app/matches"
        );
        const now = new Date();

        const matchesWithStatus = res.data.map((m) => {
          const start = new Date(m.matchDateTime);
          const end = new Date(start.getTime() + m.matchDuration * 60000);

          let status = "Upcoming";
          if (now >= start && now <= end) status = "Live";
          else if (now > end) status = "Recent";

          return { ...m, status };
        });

        matchesWithStatus.sort(
          (a, b) => new Date(a.matchDateTime) - new Date(b.matchDateTime)
        );

        setMatches(matchesWithStatus);
      } catch (err) {
        console.error("Failed to fetch matches:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, []);

  const filteredMatches =
    filter === "All" ? matches : matches.filter((m) => m.status === filter);

  if (loading)
    return <div className="text-center py-10 text-lg">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto  py-2 h-full bg-gradient-to-br from-red-100 via-yellow-50 to-green-100">
      <h2 className="text-3xl w-full bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white mb-5 font-semibold py-2  text-center">
        All Matches
      </h2>

      <div className="flex justify-center px-6 gap-3 mb-4">
        {["All", "Upcoming", "Live", "Recent"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg font-semibold transition ${
              filter === f
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Match
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Time
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Duration
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Team Size
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredMatches.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-5 text-center text-gray-500">
                  No matches found.
                </td>
              </tr>
            ) : (
              filteredMatches.map((match) => (
                <tr
                  key={match._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3">
                    <span className="text-blue-600">{match.teamAName}</span> vs{" "}
                    <span className="text-red-600">{match.teamBName}</span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(match.matchDateTime).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {new Date(match.matchDateTime).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="px-4 py-3">{match.matchDuration} mins</td>
                  <td className="px-4 py-3">{match.teamSize}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-white font-semibold text-sm ${
                        match.status === "Live"
                          ? "bg-red-500 animate-pulse"
                          : match.status === "Upcoming"
                          ? "bg-blue-500"
                          : "bg-gray-500"
                      }`}
                    >
                      {match.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMatchTable;
