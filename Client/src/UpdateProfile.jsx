import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";

const UpdateProfile = () => {
  const navigate = useNavigate();
  const { update, user, isLoading } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim() || user.displayName;
    const image = e.target.image.value.trim() || user.photoURL;

    try {
      setLoading(true);

      await update(name, image);

      if (user?.uid) {
        await fetch(
          `https://playpulse-production.up.railway.app/players/${user.uid}`,
          {
            method: "PUT", // Or PATCH depending on your API
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, avatar: image }),
          }
        );
      }

      toast.success("Profile updated successfully!");
      e.target.reset();

      setTimeout(() => {
        navigate("/myprofile");
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update profile. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="hero my-auto mt-10 animate__animated animate__fadeInDown">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <h1 className="text-2xl mt-2 text-center font-bold">
          Update Your Profile
        </h1>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <fieldset className="fieldset">
              <label className="label">Name</label>
              <input
                type="text"
                className="input"
                placeholder={user?.displayName || "Your Name"}
                name="name"
              />
              <label className="label">Image URL</label>
              <input
                type="text"
                className="input"
                placeholder={user?.photoURL || "Your Image URL"}
                name="image"
              />

              <button
                type="submit"
                className={`btn bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white mt-4 ${
                  loading ? "loading" : ""
                }`}
                disabled={loading || isLoading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProfile;
