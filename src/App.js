import * as S from "./style/AppStyle";
import { AppRoutes } from "./routes";
import { setUser } from "./store/slices/userSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getCourses } from "./api";
import { LoadingSpinner } from "./components/LoadingSpinner/LoadingSpinner";
import { FirebaseProvider } from "./FirebaseContext";

function App() {
  const dispatch = useDispatch();
  const [courses, setCourses] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
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
        console.error("Error initializing app:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [dispatch]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <FirebaseProvider>
        <div className="App">
          <S.StyLeGlobal />
          <AppRoutes courses={courses} />
        </div>
      </FirebaseProvider>
    </>
  );
}

export default App;
