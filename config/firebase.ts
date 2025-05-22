import { initializeApp } from "firebase/app";

import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";

// 1. create new project on firebase console
// 2. create a web app and copy the firebseConfigs below
const firebaseConfig = {
  apiKey: "AIzaSyCtKAwvVAaA-Vln6OhNJcZJ_DBKtv40VTg",
  authDomain: "expense-tracker-c5652.firebaseapp.com",
  projectId: "expense-tracker-c5652",
  storageBucket: "expense-tracker-c5652.firebasestorage.app",
  messagingSenderId: "285177309040",
  appId: "1:285177309040:web:7355e6eb4de971f1f451b5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
// export const auth = initializeAuth(app);

export const firestore = getFirestore(app);
