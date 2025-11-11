import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";

const CreateMatch = () => {
    const [teamAPlayers, setTeamAPlayers] = useState([]);
    const [teamBPlayers, setTeamBPlayers] = useState([]);



    const handleOnSubmit = (e) => {

        e.preventDefault();
        const teamA = e.target.teamA.value;
        const teamB = e.target.teamB.value;
        const date = e.target.date.value;
        const time = e.target.time.value;
        console.log(teamA, teamB, teamAPlayers, teamBPlayers, date, time);





    }
    return (
        <div className="max-w-lg mx-auto bg-white shadow-md rounded-2xl p-6 mt-8">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                ⚽ Create Your Match
            </h2>

            <form onSubmit={handleOnSubmit} className="space-y-4">
                {/* Team A */}
                <div>
                    <label
                        htmlFor="teamA"
                        className="block text-gray-700 font-medium mb-1"
                    >
                        Team A Name
                    </label>
                    <input
                        id="teamA"
                        type="text"
                        name="teamA"
                        placeholder="Enter Team A name"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                {/* Team B */}
                <div>
                    <label
                        htmlFor="teamB"
                        className="block text-gray-700 font-medium mb-1"
                    >
                        Team B Name
                    </label>
                    <input
                        id="teamB"
                        type="text"
                        name="teamB"
                        placeholder="Enter Team B name"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                {/* Date */}
                <div>
                    <label
                        htmlFor="date"
                        className="block text-gray-700 font-medium mb-1"
                    >
                        Match Date
                    </label>
                    <input
                        id="date"
                        type="date"
                        name="date"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                {/* Time */}
                <div>
                    <label
                        htmlFor="time"
                        className="block text-gray-700 font-medium mb-1"
                    >
                        Match Time
                    </label>
                    <input
                        id="time"
                        type="time"
                        name="time"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                {/* Duration */}
                <div>
                    <label
                        htmlFor="duration"
                        className="block text-gray-700 font-medium mb-1"
                    >
                        Duration (minutes)
                    </label>
                    <input
                        id="duration"
                        type="number"
                        name="duration"
                        min={1}
                        placeholder="Enter match duration"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                        required
                    />
                </div>

                {/* Player selection links */}
                <div className="flex flex-col gap-3 pt-2">
                    <Link
                        to="/selectPlayers"
                        className="text-center bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition"
                    >
                        Select Players for Team A
                    </Link>
                    <Link
                        to="/selectPlayers"
                        className="text-center bg-green-500 text-white font-medium py-2 rounded-lg hover:bg-green-600 transition"
                    >
                        Select Players for Team B
                    </Link>
                </div>

                {/* Create button */}
                <button
                    type="submit"
                    className="w-full mt-4 bg-black text-white py-2 rounded-lg font-semibold hover:bg-gray-800 transition"
                >
                    Create Match
                </button>
            </form>
        </div>
    );
};

export default CreateMatch;
