
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase configuration
// These keys are client-side public keys and safe to include in client code
const firebaseConfig = {
  apiKey: "AIzaSyA0xzBpgF6-S3C55w-ETuie5G8jXSIrigk",
  authDomain: "phone-authentication-21fa7.firebaseapp.com",
  projectId: "phone-authentication-21fa7",
  storageBucket: "phone-authentication-21fa7.appspot.com",
  messagingSenderId: "1071903557819",
  appId: "1:1071903557819:web:dummyappid" // Replace with your actual appId if this is a placeholder
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

export { RecaptchaVerifier } from "firebase/auth";
export default app;
