import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

const Post = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [openModalPostId, setOpenModalPostId] = useState(null);

  // Fetch all posts from backend
  useEffect(() => {
    fetch("http://localhost:3000/post")
      .then((res) => res.json())
      .then((data) => setPosts(data))
      .catch((err) => console.error("Error fetching posts:", err));
  }, []);

  // Handle Like
  const handleLike = async (postId) => {
    const post = posts.find((p) => p._id === postId);
    const currentUser = user?.displayName || "Anonymous";

    if (post.likesUsers?.includes(currentUser)) return; // prevent double like

    try {
      await fetch(`http://localhost:3000/post/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: currentUser }),
      });

      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: (p.likes || 0) + 1,
                likesUsers: [...(p.likesUsers || []), currentUser],
              }
            : p
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Comment
  const handleComment = async (e, postId) => {
    e.preventDefault();
    const text = commentText[postId];
    if (!text) return;

    const comment = { text, user: user?.displayName || "Anonymous" };

    try {
      await fetch(`http://localhost:3000/post/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
      });

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, comments: [...(post.comments || []), comment] }
            : post
        )
      );

      setCommentText((prev) => ({ ...prev, [postId]: "" }));
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  // Time ago helper
  const timeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diff = Math.floor((now - postDate) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="space-y-6 py-6 max-w-3xl mx-auto">
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">No posts yet</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="border rounded-2xl shadow-md bg-white overflow-hidden"
          >
            {/* User Info */}
            <div className="flex items-center gap-3 p-4 border-b bg-gray-100">
              <img
                src={post.userPhoto || "https://via.placeholder.com/40"}
                alt={post.username || "User"}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <span className="font-medium text-gray-800">
                  {post.username || "User"}
                </span>
                <span className="text-xs text-gray-500 block">
                  {post.createdAt ? timeAgo(post.createdAt) : ""}
                </span>
              </div>
            </div>

            {/* Caption */}
            <p className="text-gray-700 p-4">{post.caption}</p>

            {/* Post Image */}
            {post.img_url && (
              <img
                src={post.img_url}
                alt="Post"
                className="w-full max-h-[400px] object-cover"
              />
            )}

            {/* Actions */}
            <div className="p-4 space-y-3">
              {/* Like Button with tooltip */}
              <div className="relative group inline-block">
                <button
                  onClick={() => handleLike(post._id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                    post.likesUsers?.includes(user?.displayName)
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600 hover:bg-red-100 hover:text-red-600"
                  }`}
                >
                  <span className="text-lg">❤️</span>
                  <span className="font-medium">{post.likes || 0}</span>
                </button>

                {/* Tooltip */}
                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 hidden group-hover:block w-max max-w-xs bg-gray-800 text-white text-xs rounded-md shadow-lg p-2 z-10">
                  {post.likesUsers && post.likesUsers.length > 0 ? (
                    post.likesUsers.map((u, i) => (
                      <span key={i} className="block">• {u}</span>
                    ))
                  ) : (
                    <span>No reactions yet</span>
                  )}
                </div>
              </div>

              {/* Comment Button */}
              <button
                className="text-blue-500 font-semibold"
                onClick={() => setOpenModalPostId(post._id)}
              >
                💬 {post.comments?.length || 0} Comments
              </button>

              {/* Comment Modal */}
              {openModalPostId === post._id && (
                <dialog
                  open
                  className="modal modal-bottom sm:modal-middle"
                >
                  <div className="modal-box flex flex-col max-h-[70vh] w-full">
                    <h3 className="font-bold text-lg mb-2">
                      Comments for {post.username || "User"}
                    </h3>

                    {/* Comment List */}
                    <div className="overflow-y-auto" style={{ maxHeight: "300px" }}>
                      {post.comments && post.comments.length > 0 ? (
                        post.comments.map((c, idx) => (
                          <p key={idx} className="text-gray-700 text-sm mb-1">
                            <strong>{c.user}:</strong> {c.text}
                          </p>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">No comments yet</p>
                      )}
                    </div>

                    {/* Add Comment */}
                    <form
                      onSubmit={(e) => handleComment(e, post._id)}
                      className="flex gap-2 mt-4"
                    >
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText[post._id] || ""}
                        onChange={(e) =>
                          setCommentText((prev) => ({
                            ...prev,
                            [post._id]: e.target.value,
                          }))
                        }
                        className="flex-1 border px-3 py-1.5 rounded-lg text-sm"
                      />
                      <button
                        type="submit"
                        className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm"
                      >
                        Post
                      </button>
                    </form>

                    <div className="modal-action mt-2 flex justify-center">
                      <button
                          className="px-6 py-2 rounded-full font-semibold bg-gradient-to-r from-[#6A11CB] to-[#2575FC] text-white shadow-lg hover:scale-105 transition-transform duration-200"
                        onClick={() => setOpenModalPostId(null)}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </dialog>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Post;