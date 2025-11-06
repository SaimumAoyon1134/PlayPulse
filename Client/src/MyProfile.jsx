import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { FaRegUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import "animate.css";

const MyProfile = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useContext(AuthContext);

  if (isLoading) return <Loading />;
  if (!user) navigate("/");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[rgb(240,240,240)] via-[rgb(230,230,230)] to-[rgb(245,245,245)] p-6">
      <div className="w-full max-w-md bg-white/70 backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-6 animate__animated animate__fadeInDown">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 tracking-wide">
          My Profile
        </h1>

        {/* User Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28 rounded-full border-4 border-gray-300 shadow-lg overflow-hidden bg-gray-100">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaRegUserCircle className="text-9xl text-gray-500" />
            )}
          </div>
        </div>

        {/* Info Table */}
        <div className="overflow-x-auto">
          <table className="table w-full text-black">
            <thead>
              <tr>
                <th
                  colSpan={2}
                  className="text-center text-xl font-semibold pb-3 text-black border-gray-300"
                >
                  My Information
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-100 transition-all duration-200">
                <td className="font-medium py-3">User Name</td>
                <td className="py-3">{user?.displayName || "N/A"}</td>
              </tr>
              <tr className="hover:bg-gray-100 transition-all duration-200">
                <td className="font-medium py-3">Email</td>
                <td className="py-3">{user?.email || "N/A"}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/update")}
            className="px-6 py-2 rounded-full font-semibold bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white shadow-lg hover:scale-105 transition-transform duration-200"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;