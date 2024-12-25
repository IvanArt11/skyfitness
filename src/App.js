import * as S from "./style/AppStyle";
import { AppRoutes } from "./routes";
import { setUser } from "./store/slices/userSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getCourses } from "./api";
import { testFirebaseServices } from "./firebaseTest";
import { FirebaseStatus } from "./components/FirebaseStatus/FirebaseStatus";
import { LoadingSpinner } from "./components/LoadingSpinner/LoadingSpinner";
import { FirebaseProvider } from "./FirebaseContext";

function App() {
  const dispatch = useDispatch();
  const [courses, setCourses] = useState({});
  const [servicesStatus, setServicesStatus] = useState({
    isChecking: true,
    isWorking: false,
    error: null,
    details: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Проверка Firebase сервисов
        const firebaseResult = await testFirebaseServices();

        setServicesStatus({
          isChecking: false,
          isWorking: firebaseResult.allServicesWorking,
          error: firebaseResult.error || null,
          details: {
            auth: firebaseResult.auth,
            firestore: firebaseResult.firestore,
            storage: firebaseResult.storage,
          },
        });

        if (!firebaseResult.allServicesWorking) {
          console.warn(
            "Some Firebase services are not working properly:",
            firebaseResult
          );
          return;
        }

        // Получаем пользователя из localStorage
        const storedUser = JSON.parse(localStorage.getItem("user"));

        if (storedUser) {
          // Если пользователь найден, диспатчим его в Redux store

          dispatch(
            setUser({
              id: storedUser?.uid, // Проверяем наличие id
              email: storedUser?.email, // Проверяем наличие email
              token: storedUser?.stsTokenManager?.accessToken, // Проверяем наличие токена
              login: JSON.parse(localStorage.getItem("login")), // Получаем состояние логина из localStorage
            })
          );
        } else {
          console.error("User is not available in localStorage");
        }

        // Получаем курсы
        setIsLoading(true);
        const coursesData = await getCourses();
        setCourses(coursesData);
        setError(null);
      } catch (error) {
        setError(error.message);
        setServicesStatus((prev) => ({
          ...prev,
          isChecking: false,
          isWorking: false,
          error: error.message,
        }));
        console.error("Error initializing app:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  if (isLoading || servicesStatus.isChecking) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <FirebaseProvider>
        <FirebaseStatus status={servicesStatus} />
        {servicesStatus.isWorking && (
          <div className="App">
            <S.StyLeGlobal />
            <AppRoutes courses={courses} />
          </div>
        )}
      </FirebaseProvider>
    </>
  );
}

export default App;
