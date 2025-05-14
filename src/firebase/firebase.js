// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBSk4uOEyWJgNYmFmdE3NdHs-BEFuRhgQA",
  authDomain: "neighbourconnect-661d1.firebaseapp.com",
  projectId: "neighbourconnect-661d1",
  storageBucket: "neighbourconnect-661d1.firebasestorage.app",
  messagingSenderId: "498393836240",
  appId: "1:498393836240:web:3afc0e68a633c3766e4cd5",
  measurementId: "G-MZX9MXST69"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);