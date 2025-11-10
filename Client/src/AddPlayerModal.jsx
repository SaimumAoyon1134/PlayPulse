import React, { useState } from "react";
import axios from "axios";

const AddPlayerModal = ({ isOpen, onClose, onPlayerAdded }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Forward");
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !avatar) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    const newPlayer = {
      name,
      category,
      avatar,
      stats: { goals: 0, assists: 0, penalties: 0, fouls: 0, wins: 0, losses: 0 },
    };

    try {
      const res = await axios.post("http://localhost:3000/players", newPlayer);
      if (res.status === 201 || res.status === 200) {
        onPlayerAdded(res.data); // add new player to list
        setName("");
        setCategory("Forward");
        setAvatar("");
        onClose(); // close modal
      }
    } catch (err) {
      console.error("Error adding player:", err);
      alert("Failed to add player");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className=" fixed mt-25 ml-8 ">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl font-bold"
        >
          ✕
        </button>

        <div className="text-2xl font-bold text-gray-800 mb-4 text-center">
          Add New Player
        </div>

        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Player Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="Forward">Forward</option>
            <option value="Midfielder">Midfielder</option>
            <option value="Defender">Defender</option>
            <option value="Goalkeeper">Goalkeeper</option>
          </select>
          <input
            type="text"
            placeholder="Avatar URL"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 text-white font-semibold py-2 rounded-lg hover:bg-green-600 transition"
          >
            {loading ? "Adding..." : "Add Player"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPlayerModal;