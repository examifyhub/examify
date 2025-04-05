import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDCGglgPgyWwb0bpZA4H-gSn2bZJ_bxy04",
    authDomain: "examify-23d64.firebaseapp.com",
    projectId: "examify-23d64",
    storageBucket: "examify-23d64.firebasestorage.app",
    messagingSenderId: "377774726069",
    appId: "1:377774726069:web:6c13ea7fb6c61b787997fc",
    measurementId: "G-W7TFDFYFE9"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
