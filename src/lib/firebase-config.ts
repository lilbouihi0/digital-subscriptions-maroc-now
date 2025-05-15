import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA0xzBpgF6-S3C55w-ETuie5G8jXSIrigk",
  authDomain: "phone-authentication-21fa7.firebaseapp.com",
  projectId: "phone-authentication-21fa7",
  storageBucket: "phone-authentication-21fa7.appspot.com",
  messagingSenderId: "1071903557819",
  appId: "1:1071903557819:web:dummyappid", // You can find this in your Firebase settings
};

const app = initializeApp(firebaseConfig);

export default app;
