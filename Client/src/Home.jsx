import React, { useState, useRef, useContext } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { AuthContext } from "./AuthContext";
import Post from "./Post";

const Home = () => {
  const [activeTab, setActiveTab] = useState("live");
  const modalRef = useRef(null);
  const { user, setPosts } = useContext(AuthContext);

  const handlePost = () => {
    if (modalRef.current) {
      modalRef.current.showModal();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const caption = e.target.caption.value;
    const imageUrl = e.target.imageUrl.value;

    if (!user) return; 

    const postData = {
      caption,
      img_url: imageUrl,
      username: user.displayName || "Anonymous",
      userPhoto: user.photoURL || "",
      userId: user.uid,
      createdAt: new Date().toISOString(), // Add timestamp
    };

    try {
      const res = await fetch("http://localhost:3000/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      const data = await res.json();

      if (data.insertedId) {
        setPosts((prev) => [
          ...prev,
          { _id: data.insertedId, ...postData },
        ]);
        e.target.reset();
        modalRef.current.close();
      }
    } catch (err) {
      console.error("Error submitting post:", err);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="w-full flex justify-end mb-4 border-b">
        <button
          onClick={handlePost}
          className="px-6 py-2 mb-2 rounded-full font-semibold bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white shadow-lg hover:scale-105 transition-transform duration-200 flex items-center gap-2"
        >
          <AddCircleOutlineIcon /> Add Post
        </button>
      </div>

      <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
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
              <button type="submit" className="btn bg-indigo-600 text-white">
                Post
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => modalRef.current.close()}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </dialog>

      <Post />
    </div>
  );
};

export default Home;