// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDJOzobvQjsAqTWiVlF8_YMu55mbJ5zcnI",
  authDomain: "playpulse-f7706.firebaseapp.com",
  projectId: "playpulse-f7706",
  storageBucket: "playpulse-f7706.firebasestorage.app",
  messagingSenderId: "784844542657",
  appId: "1:784844542657:web:22e8025d85506df73efa40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
 export const auth = getAuth(app);