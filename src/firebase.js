import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB5bvj_7dwqmktsMWqZWpUoqhuRQcjU_s8",
  authDomain: "fitness-pro-6b7ae.firebaseapp.com",
  databaseURL: "https://fitness-pro-6b7ae-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fitness-pro-6b7ae",
  storageBucket: "fitness-pro-6b7ae.firebasestorage.app",
  messagingSenderId: "914839150963",
  appId: "1:914839150963:web:1396981af3108c19ad6506"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig);