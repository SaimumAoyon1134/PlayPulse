// import React, { useContext, useEffect, useState } from "react";
// import { AuthContext } from "./AuthContext";
// import { useNavigate } from "react-router-dom";

// const MyLive = () => {
//   const { live, setLive, setRecent } = useContext(AuthContext);
//   const [loadingMatchId, setLoadingMatchId] = useState(null);
//   const navigate = useNavigate();

 
//   const handleEndMatch = async (matchId) => {
//   try {
//     setLoadingMatchId(matchId);

//     const res = await fetch(`http://localhost:3000/matches/${matchId}/end`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json" },
//     });

//     const data = await res.json();

//     if (data.success) {
//       // Find the match first
//       const endedMatch = live.find((m) => m._id === matchId);
//       if (!endedMatch) return;

//       // Update live and recent
//       setLive((prev) => prev.filter((m) => m._id !== matchId));
//       setRecent((prev) => [
//         ...prev,
//         { ...endedMatch, isLive: false, isFinished: true },
//       ]);
//     }
//   } catch (err) {
//     console.error("Failed to end match:", err);
//   } finally {
//     setLoadingMatchId(null);
//   }
// };

//   // Navigate to match management
//   const handleManageMatch = (matchId) => {
//     navigate(`/match/${matchId}`);
//   };

//   return (
//     <div className="p-5 max-w-4xl mx-auto">
//       <h2 className="text-2xl font-semibold mb-4">Live Matches</h2>

//       {live.length === 0 ? (
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
//                   className={`px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 ${
//                     loadingMatchId === m._id ? "bg-gray-400 cursor-not-allowed" : ""
//                   }`}
//                 >
//                   {loadingMatchId === m._id ? "Ending..." : "End Match"}
//                 </button>

//                 <button
//                   onClick={() => handleManageMatch(m._id)}
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
import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const MyLive = () => {
  const { live, setLive, setRecent } = useContext(AuthContext);
  const [loadingMatchId, setLoadingMatchId] = useState(null);
  const navigate = useNavigate();

  // End match and move to recent
  const handleEndMatch = async (matchId) => {
    try {
      setLoadingMatchId(matchId);

      const res = await fetch(`http://localhost:3000/matches/${matchId}/end`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.success) {
        // Find the match first
        const endedMatch = live.find((m) => m._id === matchId);
        if (!endedMatch) return;

        // Update live and recent
        setLive((prev) => prev.filter((m) => m._id !== matchId));
        setRecent((prev) => [
          ...prev,
          { ...endedMatch, isLive: false, isFinished: true },
        ]);
      }
    } catch (err) {
      console.error("Failed to end match:", err);
    } finally {
      setLoadingMatchId(null);
    }
  };

  // Navigate to MatchManagement page for this specific match
  const handleManageMatch = (matchId) => {
    navigate(`/match/${matchId}`);
  };

  return (
    <div className="p-5 max-w-4xl mx-auto">
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
                <p className="text-sm text-gray-600">
                  Duration: {m.matchDuration} min
                </p>
                <p className="text-sm text-green-600 font-semibold">Live</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEndMatch(m._id)}
                  disabled={loadingMatchId === m._id}
                  className={`px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700 ${
                    loadingMatchId === m._id ? "bg-gray-400 cursor-not-allowed" : ""
                  }`}
                >
                  {loadingMatchId === m._id ? "Ending..." : "End Match"}
                </button>

                <button
                  onClick={() => handleManageMatch(m._id)}
                  className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
                >
                  Manage
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLive;