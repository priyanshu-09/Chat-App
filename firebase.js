// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { FIREBASE_API_KEY, FIREBASE_APP_ID, MESSAGING_SENDER_ID } from "@env";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "schmoozetask.firebaseapp.com",
  projectId: "schmoozetask",
  storageBucket: "gs://schmoozetask.appspot.com",
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
export const storage = getStorage(firebase);
