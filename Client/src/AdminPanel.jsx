import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";

const AdminPanel = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const res = await fetch("http://localhost:3000/admin/bookings");
      const data = await res.json();
      console.log(data);
      setBookings(data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;

    try {
      const res = await fetch(
        `http://localhost:3000/admin/bookings/${id}/cancel`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
        }
      );
      if (res.ok) {
        toast.success("Booking cancelled");
        setBookings((prev) =>
          prev.map((b) => (b._id === id ? { ...b, status: "Cancelled" } : b))
        );
      } else {
        toast.error("Failed to cancel");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error cancelling booking");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (!user || user.email !== "saimum681@gmail.com") {
    return (
      <p className="text-center text-red-600 mt-10">
        Access denied. Admin only.
      </p>
    );
  }

  if (loading)
    return <p className="text-center mt-10">Loading booking history...</p>;

  return (
    <div className="py-2 bg-gray-50 min-h-screen">
      <h2 className="text-3xl w-full bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white mb-5 font-semibold py-2  text-center">
        Booking History
      </h2>
      <div className="px-6 overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="table w-full text-sm">
          <thead className="bg-green-600 text-white">
            <tr>
              <th>#</th>
              <th>User</th>
              <th>Turf</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Booked At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b, idx) => (
              <tr key={b._id} className="border-b">
                <td>{idx + 1}</td>
                <td>{b.userName || b.user}</td>
                <td>{b.turfName}</td>
                <td>{b.date}</td>
                <td>
                  {b.start} - {b.end}
                </td>
                <td>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      b.status === "Cancelled"
                        ? "bg-red-200 text-red-700"
                        : b.status === "Completed"
                        ? "bg-blue-200 text-blue-700"
                        : "bg-green-200 text-green-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </td>
                <td>{new Date(b.createdAt).toLocaleString()}</td>
                <td>
                  {b.status === "Active" && (
                    <button
                      onClick={() => handleCancel(b._id)}
                      className="btn btn-xs bg-red-500 text-white hover:bg-red-600"
                    >
                      Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
