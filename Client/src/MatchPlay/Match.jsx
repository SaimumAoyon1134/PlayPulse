import React from 'react';

const Match = ({ match }) => {

    const { id, teamA, teamB, teamAPlayers, teamBPlayers, date, time } = match;
    return (
        <div className="flex justify-center my-4 px-4">
            <div className="card w-full max-w-md bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-2xl transition-all">
                <div className="card-body p-4 flex flex-col items-center text-center">

                    {/* Match Status */}
                    <span className="text-sm text-gray-500 mb-2">Upcoming Match</span>

                    {/* Teams */}
                    <div className="flex items-center justify-between w-full mb-2">
                        <h2 className="text-lg font-bold text-blue-600">{teamA}</h2>
                        <span className="text-gray-400 font-semibold mx-2">vs</span>
                        <h2 className="text-lg font-bold text-red-600">{teamB}</h2>
                    </div>

                    {/* Match Info */}
                    <div className="flex justify-between w-full text-sm text-gray-500 mb-4">
                        <span>🗓 12 Nov 2025</span>
                        <span>⏱ 7:30 PM</span>
                    </div>

                    {/* Action Button */}
                    <button className="btn btn-sm btn-primary w-full hover:btn-secondary">
                        Play Match
                    </button>
                </div>
            </div>
        </div>

    );
};

export default Match;