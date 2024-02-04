// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

{/*
const firebaseConfig = {
  apiKey: "AIzaSyBG-St9bjDw32vWpQNkmH3w5QF-SKPN2dE",
  authDomain: "se-sgh.firebaseapp.com",
  projectId: "se-sgh",
  storageBucket: "se-sgh.appspot.com",
  messagingSenderId: "574095733834",
  appId: "1:574095733834:web:5a42295d7a5c512b31a2b3",
  measurementId: "G-PWLJMQ8PF4"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

export default db;
*/}
//login firebase
const firebaseConfig = {
  apiKey: "AIzaSyBG-St9bjDw32vWpQNkmH3w5QF-SKPN2dE",
  authDomain: "se-sgh.firebaseapp.com",
  projectId: "se-sgh",
  storageBucket: "se-sgh.appspot.com",
  messagingSenderId: "574095733834",
  appId: "1:574095733834:web:5a42295d7a5c512b31a2b3",
  measurementId: "G-PWLJMQ8PF4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);
export default db;
export const auth = getAuth(app);
