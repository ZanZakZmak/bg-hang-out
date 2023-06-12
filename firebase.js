// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAl3rvFJCbnoFs7BwZ1vdasM76oB574iVQ",
  authDomain: "bghangout-backend.firebaseapp.com",
  projectId: "bghangout-backend",
  storageBucket: "bghangout-backend.appspot.com",
  messagingSenderId: "942114389791",
  appId: "1:942114389791:web:8ab0baa016b1f39814ba2a",
  measurementId: "G-B999QQN6H8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export {
  app,
  auth,
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
};
