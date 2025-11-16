import React, { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import Loading from "./Loading";
import InsertCommentIcon from '@mui/icons-material/InsertComment';

const Post = () => {
  const { user, isLoading } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [openModalPostId, setOpenModalPostId] = useState(null);

  const [loadingPosts, setLoadingPosts] = useState(true); // local loading state

  useEffect(() => {
    const fetchPosts = async () => {
      setLoadingPosts(true);
      try {
        const res = await fetch("http://localhost:3000/post");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoadingPosts(false);
      }
    };

    fetchPosts();
  }, [setPosts]);

  const handleLike = async (postId) => {
    const currentUser = user?.displayName || "Anonymous";

    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;

        const alreadyLiked = p.likesUsers?.includes(currentUser);
        const updatedLikesUsers = alreadyLiked
          ? p.likesUsers.filter((u) => u !== currentUser)
          : [...(p.likesUsers || []), currentUser];

        return {
          ...p,
          likes: alreadyLiked ? (p.likes || 1) - 1 : (p.likes || 0) + 1,
          likesUsers: updatedLikesUsers,
        };
      })
    );

    try {
      await fetch(`http://localhost:3000/post/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: currentUser }),
      });
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

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
    <div className="space-y-6  mx-auto ">
      {loadingPosts ? (
        <div className="flex justify-center items-center h-64">
          <Loading />
        </div>
      ) : posts.length === 0 ? (
        <p className="text-gray-500 text-center">No posts yet</p>
      ) : (
        posts.map((post) => (
          <div
            key={post._id}
            className="border-b border-gray-300 rounded-2xl p-3 m-3 md:m-10 shadow-md bg-gray-100 hover:scale-[1.01] overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 py-1 ">
              <img
                src={post.userPhoto || "https://via.placeholder.com/40"}
                alt={post.username || "User"}
                className="w-10 h-10 rounded-full border-2 border-green-500 object-cover"
              />
              <div>
                <span className="font-medium text-blue-600">
                  {post.username || "User"}
                </span>
                <span className="text-xs text-green-500 block">
                  {post.createdAt ? timeAgo(post.createdAt) : ""}
                </span>
              </div>
            </div>

            <p className=" p-1">{post.caption}</p>

            {post.img_url && (
              <img
                src={post.img_url}
                alt="Post"
                className="w-full  max-h-[400px] "
              />
            )}

            <div className="p-4 space-y-3" >
           <div className="flex justify-between">
               <div className="relative group inline-block">
                <button
                  onClick={() => handleLike(post._id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 ${
                    post.likesUsers?.includes(user?.displayName)
                      ? "text-red-600 scale-105"
                      : "text-gray-600 hover:text-red-500"
                  }`}
                >
                  <span className="text-lg">
                    {post.likesUsers?.includes(user?.displayName) ? "❤️" : "🤍"}
                  </span>
                  <span className="font-medium">{post.likes || 0}</span>
                </button>

                <div className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 ml-15 hidden group-hover:block w-max max-w-xs bg-gray-800 text-white text-xs rounded-md shadow-lg p-2 z-10">
                  {post.likesUsers && post.likesUsers.length > 0 ? (
                    post.likesUsers.map((u, i) => (
                      <span key={i} className="block">
                        • {u}
                      </span>
                    ))
                  ) : (
                    <span>No reactions yet</span>
                  )}
                </div>
              </div>

              <button
                className="text-blue-500 font-semibold"
                onClick={() => setOpenModalPostId(post._id)}
              >
                <InsertCommentIcon/>{post.comments?.length || 0} Comments
              </button>
           </div>

              {/* Comment Modal */}
              {openModalPostId === post._id && (
                <dialog open className="modal modal-bottom sm:modal-middle">
                  <div className="bg-white text-black modal-box flex flex-col max-h-[70vh] w-full">
                    <h3 className="font-bold text-lg mb-2">
                      Comments for {post.username || "User"}
                    </h3>

                    {/* Comment List */}
                    <div
                      className="overflow-y-auto"
                      style={{ maxHeight: "300px" }}
                    >
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
