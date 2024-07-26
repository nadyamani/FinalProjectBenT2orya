// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDjV6Dm4AGICRseJcuLxPiB2-91xZ_zEHA",
    authDomain: "finalprojectbent2orya.firebaseapp.com",
    projectId: "finalprojectbent2orya",
    storageBucket: "finalprojectbent2orya.appspot.com",
    messagingSenderId: "519200689042",
    appId: "1:519200689042:web:b878b00de02991d5440f4b",
    measurementId: "G-XPPT6LYXZL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const firestore = getFirestore(app);

export { auth, firestore };
