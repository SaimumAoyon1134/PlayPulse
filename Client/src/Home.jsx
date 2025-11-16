import React, { useState, useContext } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AuthContext } from "./AuthContext";
import Post from "./Post";
import Swal from "sweetalert2";

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user, setPosts } = useContext(AuthContext);

  // Open modal
  const handlePost = () => setIsModalOpen(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const caption = e.target.caption.value;
    const imageUrl = e.target.imageUrl.value;

    if (!user) {
      Swal.fire({
        title: "Error",
        text: "You must be logged in to post",
        icon: "error",
      });
      return;
    }

    const postData = {
      caption,
      img_url: imageUrl,
      username: user.displayName || "Anonymous",
      userPhoto: user.photoURL || "",
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(
        "https://playpulse-production.up.railway.app/post",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(postData),
        }
      );

      const data = await res.json();

      if (data.insertedId) {
        // Add post to context
        setPosts((prev) => [...prev, { _id: data.insertedId, ...postData }]);

        // Reset form
        e.target.reset();

        // Close modal
        setIsModalOpen(false);

        // SweetAlert notification
        Swal.fire({
          title: "Posted!",
          icon: "success",
          draggable: true,
        });
      } else {
        Swal.fire({
          title: "Error",
          text: "Failed to post",
          icon: "error",
        });
      }
    } catch (err) {
      console.error("Error submitting post:", err);
      Swal.fire({
        title: "Error",
        text: "Something went wrong",
        icon: "error",
      });
    }
  };

  return (
    <div className="min-h-screen pt-5 px-4">
      {/* Add Post Button */}
      <div className="w-full flex justify-end mb-4 border-b pb-2">
        <button
          onClick={handlePost}
          className="px-6 py-2 mb-2 rounded-full font-semibold bg-gradient-to-tr from-[#6A11CB] to-[#2575FC] text-white shadow-lg hover:scale-105 transition-transform duration-200 flex items-center gap-2"
        >
          <AddCircleOutlineIcon /> Add Post
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="modal modal-bottom sm:modal-middle modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add a New Post</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
              <input
                type="text"
                name="caption"
                placeholder="Enter caption"
                className="input input-bordered w-full"
                required
              />
              <input
                type="text"
                name="imageUrl"
                placeholder="Enter image URL"
                className="input input-bordered w-full"
              />
              <div className="modal-action">
                <button
                  type="submit"
                  className="btn bg-gradient-to-tr from-[#6A11CB] to-[#2575FC] text-white"
                >
                  Post
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Posts Section */}
      <Post />
    </div>
  );
};

export default Home;
