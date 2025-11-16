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
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md backdrop-blur-lg rounded-2xl shadow-xl border border-gray-200 p-6 animate__animated animate__fadeInDown">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-center mb-6  tracking-wide">
          My Profile
        </h1>

        {/* User Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28 rounded-full border-4 border-gray-300 shadow-lg overflow-hidden ">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt="User"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaRegUserCircle className="text-9xl " />
            )}
          </div>
        </div>

        {/* Info Table */}
        <div className="overflow-x-auto">
          <table className="table w-full ">
            <thead>
              <tr>
                <th
                  colSpan={2}
                  className="text-center text-xl font-semibold pb-3  border-gray-300"
                >
                  My Information
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className=" transition-all duration-200">
                <td className="font-medium py-3">User Name</td>
                <td className="py-3">{user?.displayName || "N/A"}</td>
              </tr>
              <tr className=" transition-all duration-200">
                <td className="font-medium py-3">Email</td>
                <td className="py-3">{user?.email || "N/A"}</td>
              </tr>
              <tr className=" transition-all duration-200">
                <td className="font-medium py-3">Last Login</td>
                <td className="py-3">
                  {user?.metadata?.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleString()
                    : "N/A"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/update")}
            className="px-6 py-2  font-semibold bg-gradient-to-r rounded-2xl from-[#6A11CB] to-[#2575FC] text-white shadow-lg hover:scale-105 transition-transform duration-200"
          >
            Update Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;