import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";
import { toast } from "react-toastify";
import { FaRegUserCircle } from "react-icons/fa";
import Loading from "./Loading";
import image from "./image.png"

const Navbar = () => {
  const active = "  text-white rounded-md  transition duration-300";

  const { user, logOut, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  const onClickLogin = () => {
    navigate("/login");
  };
  const onClickSignUp = () => {
    navigate("/register");
  };
  const onClickSignOut = () => {
    logOut();
    toast.success("Successfully Log Out!");
  };
  const onClickUpdate = () => {
    console.log("object");
  };
  const links = (
    <>
     
      <li>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? active : undefined)}
          >
            Home
          </NavLink>
        </li>
      {user && (
        <li>
          <NavLink
            to="/manage-announcement"
            className={({ isActive }) => (isActive ? active : undefined)}
          >
            Announcement
          </NavLink>
        </li>
      )}
    </>
  );
  return (
    <div className="navbar bg-base-100 shadow-sm bg-gradient-to-r from-[rgb(3,9,71)] via-[rgb(96,65,240)] to-[rgb(3,3,40)]">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost text-white lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
          
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex="-1"
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
          >
            {links}
          </ul>
        </div>
        <NavLink to={"/"} className="btn btn-ghost text-xl">
          <img className="w-[40px] h-[40px] " src={image} alt="" />
          <p className="hidden md:flex text-white font-extrabold">Play Pulse</p>
        </NavLink>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{links}</ul>
      </div>
      <div className="navbar-end">
        {isLoading ? (
          <span className="loading loading-spinner loading-xl"></span>
        ) : user ? (
          <>
            <div
              className="tooltip tooltip-bottom"
              data-tip={user?.displayName || "User"}
            >
              <div
                onClick={() => {
                  navigate("/myprofile");
                }}
                className="mr-2 border-1 hover:border-2 border-black hover:border-green-500 rounded-full w-10 h-10 flex items-center justify-center overflow-hidden cursor-pointer"
              >
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="User"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <FaRegUserCircle className="text-2xl" />
                )}
              </div>
            </div>

            <button onClick={onClickSignOut} className="btn h-9 rounded-2xl bg-[rgb(31,25,95)] text-white">
              Sign Out
            </button>
          </>
        ) : (
          <div className="flex flex-row space-x-1">
            <button onClick={onClickLogin} className="btn h-9 rounded-2xl bg-[rgb(31,25,95)] text-white">
              Sign In
            </button>
            <button onClick={onClickSignUp} className="btn h-9 rounded-2xl bg-[rgb(31,25,95)] text-white">
              Sign Up
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
