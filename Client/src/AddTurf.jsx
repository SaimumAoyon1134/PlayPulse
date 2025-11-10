import { div } from "framer-motion/client";
import React, { useState } from "react";

const AddTurf = () => {
  const [turf, setTurf] = useState({
    name: "",
    location: "",
    price: "",
    description: "",
    image: "", // now a URL string
    slots: [],
  });

  const [slot, setSlot] = useState({ start: "", end: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTurf((prev) => ({ ...prev, [name]: value }));
  };

  const addSlot = () => {
    if (!slot.start || !slot.end) return;
    setTurf((prev) => ({
      ...prev,
      slots: [...prev.slots, { start: slot.start, end: slot.end }],
    }));
    setSlot({ start: "", end: "" });
  };

  const removeSlot = (index) => {
    setTurf((prev) => ({
      ...prev,
      slots: prev.slots.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:3000/turfs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(turf),
      });
      const data = await res.json();
      console.log("Turf added:", data);
      alert("Turf added successfully!");
      setTurf({
        name: "",
        location: "",
        price: "",
        description: "",
        image: "",
        slots: [],
      });
    } catch (err) {
      console.error(err);
      alert("Failed to add turf.");
    }
  };

  return (
    <div className="py-2 bg-gradient-to-br from-red-100 via-yellow-50 to-green-100">
         <h2 className="text-3xl w-full bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white mb-5 font-semibold py-2  text-center">
        Add New Football Turf
      </h2>
        <div className=" mx-auto   p-6 bg-white rounded-xl shadow-lg bg-gradient-to-br from-red-100 via-yellow-50 to-green-100 ">
     
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Turf Name</label>
          <input
            type="text"
            name="name"
            value={turf.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Location</label>
          <input
            type="text"
            name="location"
            value={turf.location}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Price (per hour)</label>
          <input
            type="number"
            name="price"
            value={turf.price}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea
            name="description"
            value={turf.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Image URL</label>
          <input
            type="text"
            name="image"
            value={turf.image}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>
        {/* Mobile Number */}
        <label className="block mb-1 font-medium">Mobile Number</label>
        <input
          type="text"
          name="mobile"
          value={turf.mobile || ""}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="e.g., 017XXXXXXXX"
          required
        />
        {/* Time Slots */}
        <div className="border rounded-lg p-4 bg-gradient-to-br from-red-100 via-yellow-50 to-green-100">
          <h3 className="font-semibold mb-2">Add Time Slots</h3>
          <div className="flex gap-2 mb-2">
            <input
              type="time"
              value={slot.start}
              onChange={(e) =>
                setSlot((prev) => ({ ...prev, start: e.target.value }))
              }
              className="border px-2 py-1 rounded-lg w-full"
            />
            <input
              type="time"
              value={slot.end}
              onChange={(e) =>
                setSlot((prev) => ({ ...prev, end: e.target.value }))
              }
              className="border px-2 py-1 rounded-lg w-full"
            />
            <button
              type="button"
              onClick={addSlot}
              className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
            >
              Add
            </button>
          </div>
          {turf.slots.length > 0 && (
            <ul className="max-h-40 overflow-y-auto border rounded p-2 bg-white">
              {turf.slots.map((s, idx) => (
                <li
                  key={idx}
                  className="flex justify-between items-center mb-1"
                >
                  <span>
                    {s.start} - {s.end}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSlot(idx)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg"
        >
          Add Turf
        </button>
      </form>
    </div>
    </div>
  );
};

export default AddTurf;
