// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBeriDIb_kxnsvwjlJlW0KWu-xC9u1mu6U",
  authDomain: "test2-a8f2e.firebaseapp.com",
  databaseURL: "https://test2-a8f2e-default-rtdb.firebaseio.com",
  projectId: "test2-a8f2e",
  storageBucket: "test2-a8f2e.appspot.com",
  messagingSenderId: "716273921440",
  appId: "1:716273921440:web:65b14e173c85178a3908c5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
