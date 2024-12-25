import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_ID_API,
  
  // apiKey: "AIzaSyB5bvj_7dwqmktsMWqZWpUoqhuRQcjU_s8",
  // authDomain: "fitness-pro-6b7ae.firebaseapp.com",
  // databaseURL:
  //   "https://fitness-pro-6b7ae-default-rtdb.europe-west1.firebasedatabase.app",
  // projectId: "fitness-pro-6b7ae",
  // storageBucket: "fitness-pro-6b7ae.firebasestorage.app",
  // messagingSenderId: "914839150963",
  // appId: "1:914839150963:web:1396981af3108c19ad6506",
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);

// Инициализация сервисов
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
