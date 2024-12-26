import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  // authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  // databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  // projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  // appId: process.env.REACT_APP_FIREBASE_ID_API,

  apiKey: "AIzaSyB5bvj_7dwqmktsMWqZWpUoqhuRQcjU_s8",
  authDomain: "fitness-pro-6b7ae.firebaseapp.com",
  databaseURL:
    "https://fitness-pro-6b7ae-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "fitness-pro-6b7ae",
  storageBucket: "fitness-pro-6b7ae.firebasestorage.app",
  messageSenderId: "914839150963",
  appId: "1:914839150963:web:1396981af3108c19ad6506",
};

// Временное решение для отладки
console.log("Firebase Config:", {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_ID_API,
});

// Проверка наличия необходимых переменных окружения
// const requiredEnvVars = [
//   "REACT_APP_FIREBASE_API_KEY",
//   "REACT_APP_FIREBASE_AUTH_DOMAIN",
//   "REACT_APP_FIREBASE_DATABASE_URL",
//   "REACT_APP_FIREBASE_PROJECT_ID",
//   "REACT_APP_FIREBASE_STORAGE_BUCKET",
//   "REACT_APP_FIREBASE_MESSAGING_SENDER_ID",
//   "REACT_APP_FIREBASE_ID_API",
// ];

// const missingEnvVars = requiredEnvVars.filter(
//   (varName) => !process.env[varName]
// );

// if (missingEnvVars.length > 0) {
//   throw new Error(
//     `Missing required environment variables: ${missingEnvVars.join(", ")}`
//   );
// }

// Инициализация Firebase с проверкой конфигурации
let app;
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw error;
}

// Инициализация сервисов с обработкой ошибок
let auth, db, storage;

try {
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  console.log("Firebase services initialized successfully");
} catch (error) {
  console.error("Error initializing Firebase services:", error);
  throw error;
}

export { auth, db, storage };
export default app;
