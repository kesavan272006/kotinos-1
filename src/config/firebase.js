// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA-Uvz7WgFomQCRMNNG7R6sEsWVIiCpaWI",
  authDomain: "kotinos-3a963.firebaseapp.com",
  projectId: "kotinos-3a963",
  storageBucket: "kotinos-3a963.firebasestorage.app",
  messagingSenderId: "1046079812733",
  appId: "1:1046079812733:web:fa67bca191c4b8d49f6d14",
  measurementId: "G-V3QZ62CNB3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const googleprovider = new GoogleAuthProvider(app);