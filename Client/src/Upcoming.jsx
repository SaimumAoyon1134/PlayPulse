import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import Loading from "./Loading";

const Upcoming = () => {
  const { upcoming, isLoading } = useContext(AuthContext);
// if(isLoading)return <Loading/>
  if (!upcoming )
    return <Loading/>;

 
  const sortedUpcoming = [...upcoming].sort((a, b) => {
    const dateA = new Date(`${a.matchDate}T${a.matchTime}`);
    const dateB = new Date(`${b.matchDate}T${b.matchTime}`);
    return dateA - dateB;
  });

 

  return (
    <div className="max-w-6xl  mx-auto px-6 py-6 space-y-10">

      

 
      <div>


        {sortedUpcoming.length === 0 ? (
             <div className="flex flex-col items-center justify-center text-center p-8 rounded-xl bg-red-400  shadow-md border border-gray-200 space-y-3">
  <svg
    className="w-12 h-12 text-white"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 17v-2a4 4 0 018 0v2m-4-4v4m0-4H7m10 0h-2"
    />
  </svg>
  <span className="text-white text-lg font-medium">
    No Upcoming matches right now
  </span>
  <span className="text-white text-sm">
    Opss!! Check back later for upcoming matches!
  </span>
</div>
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