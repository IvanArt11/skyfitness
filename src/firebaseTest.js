import { auth, db, storage } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { ref, listAll } from "firebase/storage";

export const testFirebaseServices = async () => {
  try {
    // Проверка Auth
    const authTest = new Promise((resolve) => {
      const unsubscribe = auth.onAuthStateChanged((user) => {
        console.log(
          "Auth service status:",
          user ? "Authenticated" : "Not authenticated"
        );
        unsubscribe(); // Отписываемся от слушателя
        resolve(true);
      });
    });

    // Проверка Firestore
    const firestoreTest = async () => {
      try {
        const testQuery = await getDocs(collection(db, "test"));
        console.log("Firestore service status: Connected");
        return true;
      } catch (error) {
        console.error("Firestore service error:", error);
        return false;
      }
    };

    // Проверка Storage
    const storageTest = async () => {
      try {
        const storageRef = ref(storage);
        await listAll(storageRef);
        console.log("Storage service status: Connected");
        return true;
      } catch (error) {
        console.error("Storage service error:", error);
        return false;
      }
    };

    // Выполняем все проверки
    const [authResult, firestoreResult, storageResult] = await Promise.all([
      authTest,
      firestoreTest(),
      storageTest(),
    ]);

    return {
      auth: authResult,
      firestore: firestoreResult,
      storage: storageResult,
      allServicesWorking: authResult && firestoreResult && storageResult,
    };
  } catch (error) {
    console.error("Firebase services test failed:", error);
    return {
      auth: false,
      firestore: false,
      storage: false,
      allServicesWorking: false,
      error: error.message,
    };
  }
};
