import React, { use, useEffect, useState } from "react";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";



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
  const [announcements, setAnnouncements] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("http://localhost:3000/post");
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };
    fetchPosts();
  }, []);
  
  const signUp = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const signIn = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const googleSignIn = async () => {
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, provider);
      setUser(result.user);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const logOut = () => {
    signOut(auth)
      .then(() => {
        console.log("Sign-out successful.");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const reset = (email) => {
    sendPasswordResetEmail(auth, email)
      .then(() => {})
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });
    return () => {
      unSubscribe();
    };
  }, []);
  useEffect(() => {
    console.log("User changed:", user);
  }, [user]);
  
const update = async (name, image) => {
  if (auth.currentUser) {
    setIsLoading(true); 
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: image,
      });

      setUser({ ...auth.currentUser }); 
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false); 
    }
  }
};
  const authInfo = {
    signUp,
    signIn,
    user,
    logOut,
    reset,
    isLoading,
    update,
    googleSignIn,
    announcements,
    setAnnouncements,
    posts, 
    setPosts
  };
  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;