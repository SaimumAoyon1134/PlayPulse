import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";

const Upcoming = () => {
  const { upcoming } = useContext(AuthContext);

  if (!upcoming )
    return <div className="text-center py-10 text-lg">Loading...</div>;

 
  const sortedUpcoming = [...upcoming].sort((a, b) => {
    const dateA = new Date(`${a.matchDate}T${a.matchTime}`);
    const dateB = new Date(`${b.matchDate}T${b.matchTime}`);
    return dateA - dateB;
  });

 

  return (
    <div className="max-w-6xl mx-auto px-6 py-6 space-y-10">

      

 
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-blue-700"> Upcoming Matches</h2>

        {sortedUpcoming.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No upcoming matches.</p>
        ) : (
          <div className="grid grid-cols-1 gap-8">
            {sortedUpcoming.map((match) => (
              <div
                key={match._id}
                className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 
                rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 p-6"
              >
                <h3 className="text-center text-xl font-semibold text-gray-900 mb-3">
                  <span className="text-blue-600">{match.teamAName}</span>{" "}
                  <span className="text-gray-500">vs</span>{" "}
                  <span className="text-red-600">{match.teamBName}</span>
                </h3>

                <div className="flex justify-center gap-5 text-sm text-gray-700">
                  <p>
                    <span className="font-medium text-gray-900">📅 Date:</span>{" "}
                    {match.matchDate}
                  </p>
                  <p>
                    <span className="font-medium text-gray-900">⏰ Time:</span>{" "}
                    {match.matchTime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Upcoming;