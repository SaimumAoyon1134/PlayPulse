import React from "react";
import Match from "./Match";

const matches = [
    { id: 1, teamA: "tomal", teamB: "Saimum", teamAPlayers: [], teamBPlayers: [], date: '', time: '' },
    { id: 2, teamA: "aminul", teamB: "Tanzed", teamAPlayers: [], teamBPlayers: [], date: '', time: '' },
    { id: 3, teamA: "ehsun", teamB: "mahmud", teamAPlayers: [], teamBPlayers: [], date: '', time: '' },
];

const Matches = () => {
    return (
        <div className="h-screen overflow-y-auto p-4 bg-gray-50">
            {/* Header */}
            <div className="text-center text-2xl font-bold text-gray-800 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent mb-6">
                Your Matches Here
            </div>

            {/* Matches list */}
            <div className="space-y-4">
                {matches.map((match) => (
                    <Match key={match.id} match={match} />
                ))}
            </div>
        </div>
    );
};

export default Matches;
