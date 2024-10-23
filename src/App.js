import * as S from "./style/AppStyle";
import { AppRoutes } from "./routes";
import { setUser } from "./store/slices/userSlice";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getCourses } from "./api";

function App() {
  const dispatch = useDispatch();
  const [courses, setCourses] = useState({});

  useEffect(() => {
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

    // Получаем курсы через API и обновляем состояние
    getCourses().then((courses) => {
      setCourses(courses);
    });
  }, [dispatch]);

  return (
    <>
      <S.StyLeGlobal />
      <AppRoutes courses={courses} />
    </>
  );
}

export default App;