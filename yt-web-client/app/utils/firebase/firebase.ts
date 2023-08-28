// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFunctions } from "firebase/functions";
import {getAuth, signInWithPopup, GoogleAuthProvider,onAuthStateChanged, User} from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

//Google login
//https://firebase.google.com/docs/auth/web/google-signin

// Your web app's Firebase configuration (idk why doesnt work, online lots of people have the same issue)
// const firebaseConfig = {
//   apiKey: process.env.API_KEY,
//   authDomain: process.env.AUTH_DOMAIN,
//   projectId: process.env.PROJECT_ID,
// //   storageBucket: process.env.STORAGE_BUCKET, // we alr have cloud storage
// //   messagingSenderId: process.env.MESSAGING_SENDER_ID, //we alr have pub/sub
//   appId: process.env.APP_ID,
// };

const firebaseConfig = {
  apiKey: "AIzaSyBKXQwzD-gZCQsNh2YuiuPPPhiAPDRKuV4",
  authDomain: "yt-clone-5af0b.firebaseapp.com",
  projectId: "yt-clone-5af0b",
  appId: "1:178114160758:web:893e540378d5ae30d55757"
};

console.log("testing top level code when import, this line should be logged to console when app starts, as we imported functions from this file");
//this explains how firebase is being initialised, when we visit a page with any imported functions from this file, initaliseApp will be called, and firebase will be initialised

console.log(firebaseConfig);
// https://firebase.google.com/docs/auth/web/start?authuser=5
// https://firebase.google.com/docs/auth/web/start
// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

export const functions = getFunctions();

/**
 * Signs the user in with a Google popup.
 * @returns A promise that resolves with the user's credentials.
 */
export function signInWithGoogle() {
  return signInWithPopup(auth, new GoogleAuthProvider);//https://firebase.google.com/docs/auth/web/google-signin
}

/**
 * Signs the user out.
 * @returns A promise that resolves when the user is signed out.
 */
export function signOut() {
  return auth.signOut();//https://firebase.google.com/docs/auth/web/google-signin
}

/**
 * Trigger a callback when user auth state changes.
 * @returns A function to unsubscribe callback.
 */
export function onAuthStateChangedHelper(callback: (user:User | null) => void) { //higher-order function, onAuthStateChangedHelper is our higherlevelfunction,  so we are accepting a function as a parameter, and that function has a parameter user, and return type of void
  return onAuthStateChanged(auth, callback); //https://firebase.google.com/docs/auth/web/manage-users
  // returns unsubscribe function, and whenever the auth state changes, the callback function will be called (callbackfunction is just the setState thing in navbar.tsx)
}

console.log("testing top level code when import, this line is also logged to console, it is at the end of file");