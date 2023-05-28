// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBYrgy8K6nlxukadX_yV-PeNLU3SWyK148",
  authDomain: "schmoozetask.firebaseapp.com",
  projectId: "schmoozetask",
  storageBucket: "gs://schmoozetask.appspot.com",
  messagingSenderId: "1074102905018",
  appId: "1:1074102905018:web:03c38e7597e8b409257a83",
};

// Initialize Firebase
export const firebase = initializeApp(firebaseConfig);
export const storage = getStorage(firebase);
