import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext";

const Post = () => {
  const { posts, user, setPosts } = useContext(AuthContext);
  const [commentText, setCommentText] = useState({});

  const handleLike = (postId) => {
    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? { ...post, likes: (post.likes || 0) + 1 }
          : post
      )
    );
  };

  const handleComment = (e, postId) => {
    e.preventDefault();
    const text = commentText[postId];
    if (!text) return;

    setPosts((prev) =>
      prev.map((post) =>
        post._id === postId
          ? {
              ...post,
              comments: [...(post.comments || []), { text, user: user.displayName }],
            }
          : post
      )
    );

    setCommentText((prev) => ({ ...prev, [postId]: "" }));
  };

  const timeAgo = (dateString) => {
    const now = new Date();
    const postDate = new Date(dateString);
    const diff = Math.floor((now - postDate) / 1000); // diff in seconds

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
  };

  return (
    <div className="space-y-6">
      {posts.length === 0 ? (
        <p className="text-gray-500 text-center">No posts yet</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="border rounded-2xl shadow-md bg-gray-100 overflow-hidden">
            <div className="flex flex-col gap-1 p-4 border-b bg-gray-300">
              <div className="flex items-center gap-3">
                <img
                  src={post.userPhoto || "https://via.placeholder.com/40"}
                  alt={post.username || "User"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-gray-800">
                    {post.username || "User"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {post.createdAt ? timeAgo(post.createdAt) : ""}
                  </span>
                </div>
              </div>
            </div>
             <p className="text-gray-700 p-4">{post.caption}</p>
            {post.img_url && (
              <img
                src={post.img_url}
                alt="Post"
                className="w-full max-h-[400px] object-cover"
              />
            )}

            <div className="p-4 space-y-2">
             

              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleLike(post._id)}
                  className="text-red-500 font-semibold"
                >
                  ❤️ {post.likes || 0}
                </button>
              </div>

              <div className="mt-2 space-y-2">
                {post.comments &&
                  post.comments.map((c, idx) => (
                    <p key={idx} className="text-gray-600">
                      <span className="font-semibold">{c.user}:</span> {c.text}
                    </p>
                  ))}

                <form
                  onSubmit={(e) => handleComment(e, post._id)}
                  className="flex gap-2"
                >
                  {/* <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText[post._id] || ""}
                    onChange={(e) =>
                      setCommentText((prev) => ({
                        ...prev,
                        [post._id]: e.target.value,
                      }))
                    }
                    className="input input-bordered flex-1"
                    required
                  />
                  <button type="submit" className="btn btn-sm">
                    Comment
                  </button> */}
                </form>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Post;