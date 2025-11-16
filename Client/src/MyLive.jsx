// import React, { useContext, useState } from "react";
// import { AuthContext } from "./AuthContext";
// import MatchManagement from "./MatchManagement";

// const MyLive = () => {
//   const { live, setLive, setRecent, fetchMatches } = useContext(AuthContext);
//   const [loadingMatchId, setLoadingMatchId] = useState(null);
//   const [selectedMatch, setSelectedMatch] = useState(null);

//   // End match and move to recent (backend + local state)
//   const handleEndMatch = async (matchId) => {
//     try {
//       setLoadingMatchId(matchId);

//       const res = await fetch(`http://localhost:3000/matches/${matchId}/end`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//       });

//       const data = await res.json();

//       if (data.success) {
//         // optimistic local update
//         const ended = live.find((m) => m._id === matchId);
//         if (ended) {
//           setLive((prev) => prev.filter((m) => m._id !== matchId));
//           setRecent((prev) => [...prev, { ...ended, isLive: false, isFinished: true }]);
//         }
//         // refresh from server if you want canonical data
//         if (fetchMatches) fetchMatches();
//       } else {
//         console.error("Failed ending match:", data);
//       }
//     } catch (err) {
//       console.error("Failed to end match:", err);
//     } finally {
//       setLoadingMatchId(null);
//     }
//   };

//   // When Manage is clicked, display MatchManagement inline for that match
//   const handleManage = (match) => {
//     setSelectedMatch(match);
//   };

//   const handleCloseManagement = () => {
//     setSelectedMatch(null);
//     // refresh after closing (optional)
//     if (fetchMatches) fetchMatches();
//   };

//   // If a match is selected, show MatchManagement only for that match
//   if (selectedMatch) {
//     return (
//       <div className="p-5 max-w-4xl mx-auto">
//         <MatchManagement
//           match={selectedMatch}
//           goBack={handleCloseManagement}
//         />
//       </div>
//     );
//   }

//   return (
//     <div className="p-5 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-semibold mb-4">Live Matches</h2>

//       {(!live || live.length === 0) ? (
//         <p className="text-gray-500">No live matches currently.</p>
//       ) : (
//         <div className="space-y-4">
//           {live.map((m) => (
//             <div
//               key={m._id}
//               className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center"
//             >
//               <div>
//                 <h3 className="text-lg font-bold">
//                   {m.teamAName} vs {m.teamBName}
//                 </h3>
//                 <p className="text-sm text-gray-600">
//                   {m.matchDate} — {m.matchTime}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Duration: {m.matchDuration} min
//                 </p>
//                 <p className="text-sm text-green-600 font-semibold">Live</p>
//               </div>

//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handleEndMatch(m._id)}
//                   disabled={loadingMatchId === m._id}
//                   className={`px-4 py-2 rounded-lg text-white ${
//                     loadingMatchId === m._id ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
//                   }`}
//                 >
//                   {loadingMatchId === m._id ? "Ending..." : "End Match"}
//                 </button>

//                 <button
//                   onClick={() => handleManage(m)}
//                   className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
//                 >
//                   Manage
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default MyLive;


// MyLive.jsx
import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import MatchManagement from "./MatchManagement";

const MyLive = () => {
  const { live = [], fetchMatches } = useContext(AuthContext);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [endingId, setEndingId] = useState(null);

  const openManager = (match) => {
    setSelectedMatch(match);
  };

  const closeManager = async () => {
    setSelectedMatch(null);
    // refresh lists from server
    if (fetchMatches) await fetchMatches();
  };

  const handleEndMatch = async (matchId) => {
    try {
      setEndingId(matchId);
      const res = await fetch(`http://localhost:3000/matches/${matchId}/end`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (data.success) {
        // refresh lists
        if (fetchMatches) await fetchMatches();
      } else {
        console.error("End match failed", data);
        alert("Failed to end match. See console.");
      }
    } catch (err) {
      console.error("Failed to end match:", err);
      alert("Error ending match. See console.");
    } finally {
      setEndingId(null);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Live Matches</h2>

      {live.length === 0 ? (
        <p className="text-gray-500">No live matches currently.</p>
      ) : (
        <div className="space-y-4">
          {live.map((m) => (
            <div
              key={m._id}
              className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold">
                  {m.teamAName} vs {m.teamBName}
                </h3>
                <p className="text-sm text-gray-600">
                  {m.matchDate} — {m.matchTime}
                </p>
                <p className="text-sm text-green-600 font-semibold">Live</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => openManager(m)}
                  className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                >
                  Manage
                </button>

                <button
                  onClick={() => handleEndMatch(m._id)}
                  disabled={endingId === m._id}
                  className={`px-4 py-2 rounded-lg text-white ${
                    endingId === m._id ? "bg-gray-400" : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {endingId === m._id ? "Ending..." : "End"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inline manager modal / panel */}
      {selectedMatch && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-3xl">
            <MatchManagement match={selectedMatch} goBack={closeManager} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyLive;