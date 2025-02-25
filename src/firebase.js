// Импорт необходимых модулей из Firebase
import { initializeApp } from "firebase/app"; // Для инициализации Firebase
import { getAuth } from "firebase/auth"; // Для работы с аутентификацией
import { getFirestore } from "firebase/firestore"; // Для работы с базой данных Firestore
import { getStorage } from "firebase/storage"; // Для работы с хранилищем файлов

// Конфигурация Firebase, которая берется из переменных окружения
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY, // Ключ API для доступа к Firebase
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN, // Домен для аутентификации
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL, // URL базы данных Realtime Database
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID, // ID проекта Firebase
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET, // Бакет для хранения файлов
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID, // ID отправителя для сообщений
  appId: process.env.REACT_APP_FIREBASE_ID_API, // ID приложения Firebase
};

// Список обязательных переменных окружения
const requiredEnvVars = [
  "REACT_APP_FIREBASE_API_KEY",
  "REACT_APP_FIREBASE_AUTH_DOMAIN",
  "REACT_APP_FIREBASE_DATABASE_URL",
  "REACT_APP_FIREBASE_PROJECT_ID",
  "REACT_APP_FIREBASE_STORAGE_BUCKET",
  "REACT_APP_FIREBASE_MESSAGING_SENDER_ID",
  "REACT_APP_FIREBASE_ID_API",
];

// Проверка, все ли обязательные переменные окружения заданы
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

// Если отсутствуют какие-либо переменные, выбрасываем ошибку
if (missingEnvVars.length > 0) {
  throw new Error(
    `Отсутствуют необходимые переменные окружения: ${missingEnvVars.join(", ")}`
  );
}

// Инициализация Firebase
let app;
try {
  app = initializeApp(firebaseConfig); // Инициализация приложения Firebase
  console.log("Firebase успешно инициализирован"); // Логирование успешной инициализации
} catch (error) {
  console.error("Ошибка при инициализации Firebase:", error); // Логирование ошибки
  throw error; // Прерывание выполнения приложения в случае ошибки
}

// Инициализация сервисов Firebase
let auth, db, storage;

try {
  auth = getAuth(app); // Инициализация сервиса аутентификации
  db = getFirestore(app); // Инициализация Firestore (база данных)
  storage = getStorage(app); // Инициализация хранилища файлов
  console.log("Сервисы Firebase успешно инициализированы"); // Логирование успешной инициализации сервисов
} catch (error) {
  console.error("Ошибка при инициализации сервисов Firebase:", error); // Логирование ошибки
  throw error; // Прерывание выполнения приложения в случае ошибки
}

// Экспорт сервисов для использования в других частях приложения
export { auth, db, storage };

// Экспорт приложения Firebase по умолчанию
export default app;
