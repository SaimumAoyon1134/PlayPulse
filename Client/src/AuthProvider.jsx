import React, { useEffect, useState, useRef } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { io } from "socket.io-client";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth } from "../firebase.init";

const provider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [upcoming, setUpcoming] = useState([]);
  const [live, setLive] = useState([]);
  const [recent, setRecent] = useState([]);
  const [players, setPlayers] = useState([]);

  const socketRef = useRef(null);

 const [posts, setPosts] = useState([]); // <-- add this

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:3000/post");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      }
    };
    fetchPosts();
  }, []);


  useEffect(() => {
    
    socketRef.current = io("http://localhost:3000", { transports: ["websocket"] });
    const socket = socketRef.current;

    
    socket.on("match-start", (match) => {
      setLive((prev) => [...prev, match]);
      setUpcoming((prev) => prev.filter((m) => m._id !== match._id));
    });

    // Match updated (stats etc.)
    socket.on("match-update", (match) => {
      setLive((prev) => prev.map((m) => (m._id === match._id ? { ...m, ...match } : m)));
    });

    // Match ended
    socket.on("match-end", (match) => {
      setLive((prev) => prev.filter((m) => m._id !== match._id));
      setRecent((prev) => [...prev, match]);
    });

    // Cleanup on unmount
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  // --------------------------
  // FETCH PLAYERS
  // --------------------------
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const res = await fetch("http://localhost:3000/players");
        const data = await res.json();
        setPlayers(data);
      } catch (err) {
        console.error("Failed to fetch players:", err);
      }
    };
    fetchPlayers();
  }, []);


  const fetchMatches = async () => {
    try {
      // setIsLoading(true);
      const res = await fetch("http://localhost:3000/matches");
      const data = await res.json();

      const upcomingArr = [];
      const liveArr = [];
      const recentArr = [];

      data.forEach((m) => {
        if (m.isLive) liveArr.push(m);
        else if (m.isFinished) recentArr.push(m);
        else upcomingArr.push(m);
      });

      setUpcoming(upcomingArr);
      setLive(liveArr);
      setRecent(recentArr);
    } catch (err) {
      console.error("Failed to fetch matches:", err);
    }
     finally {
    
  }
  };

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 500); 
    return () => clearInterval(interval);
  }, []);


  const signUp = (email, password) => createUserWithEmailAndPassword(auth, email, password);

  const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password);

  const googleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (err) {
      console.error("Google sign-in failed:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const logOut = () => signOut(auth);

  const reset = (email) => sendPasswordResetEmail(auth, email);

  const update = async (name, image) => {
    if (!auth.currentUser) return;
    setIsLoading(true);
    try {
      await updateProfile(auth.currentUser, { displayName: name, photoURL: image });
      setUser({ ...auth.currentUser });
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  
  const authInfo = {
    user,
    isLoading,
    signUp,
    signIn,
    googleSignIn,
    logOut,
    reset,
    update,
    upcoming,
    live,
    recent,
    fetchMatches,
    players,
    setUpcoming,
    posts, 
    setPosts,

  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;