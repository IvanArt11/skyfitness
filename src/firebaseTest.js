import { auth, db } from "./firebase"; // Импорт сервисов Firebase (auth и db)
// import { auth, db, storage } from "./firebase"; // Раскомментируйте, если нужно использовать Storage
import { collection, getDocs } from "firebase/firestore"; // Импорт методов Firestore
// import { ref, listAll } from "firebase/storage"; // Раскомментируйте, если нужно использовать Storage

/**
 * Функция для тестирования работы сервисов Firebase.
 * Проверяет доступность аутентификации, Firestore и localStorage.
 * Возвращает объект с результатами проверки.
 */
export const testFirebaseServices = async () => {
  try {
    // Проверка аутентификации (auth)
    const authTest = new Promise((resolve) => {
      // Подписываемся на изменение состояния аутентификации
      const unsubscribe = auth.onAuthStateChanged((user) => {
        console.log(
          "Auth service status:",
          user ? "Authenticated" : "Not authenticated"
        );
        unsubscribe(); // Отписываемся от слушателя после получения результата
        resolve(true); // Возвращаем успешный результат
      });
    });

    // Проверка Firestore (db)
    const firestoreTest = async () => {
      try {
        // Пытаемся получить данные из коллекции "test"
        const testQuery = await getDocs(collection(db, "test"));
        console.log("Firestore service status: Connected");
        return true; // Возвращаем успешный результат
      } catch (error) {
        console.error("Firestore service error:", error);
        return false; // Возвращаем false в случае ошибки
      }
    };

    // Проверка localStorage (и Storage, если раскомментировано)
    const storageTest = async () => {
      try {
        // Пример проверки Firebase Storage (раскомментируйте, если нужно)
        // const storageRef = ref(storage);
        // await listAll(storageRef);
        // console.log("Storage service status: Connected");

        // Проверка доступности localStorage
        localStorage.setItem("test", "test"); // Записываем тестовое значение
        localStorage.removeItem("test"); // Удаляем тестовое значение
        console.log("Local Storage status: Available");
        return true; // Возвращаем успешный результат
      } catch (error) {
        console.error("Local Storage error:", error);
        // console.error("Storage service error:", error); // Раскомментируйте, если нужно
        return false; // Возвращаем false в случае ошибки
      }
    };

    // Параллельное выполнение всех проверок
    const [authResult, firestoreResult, storageResult] = await Promise.all([
      authTest,
      firestoreTest(),
      storageTest(),
    ]);

    // Возвращаем объект с результатами проверки
    return {
      auth: authResult, // Результат проверки аутентификации
      firestore: firestoreResult, // Результат проверки Firestore
      storage: storageResult, // Результат проверки localStorage (и Storage)
      allServicesWorking: authResult && firestoreResult && storageResult, // Общий статус работы всех сервисов
    };
  } catch (error) {
    // Обработка ошибок, если что-то пошло не так
    console.error("Services test failed:", error);
    return {
      auth: false,
      firestore: false,
      storage: false,
      allServicesWorking: false, // Все сервисы не работают
      error: error.message, // Сообщение об ошибке
    };
  }
};
