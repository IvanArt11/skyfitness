import { Route, Routes } from "react-router-dom";
import { NotFoundPage } from "./page/NotFound/NotFoundPage";
import { MainPage } from "./page/Main/MainPage";
import { TrainingPage } from "./page/Training/TrainingPage";
import { ProfilePage } from "./page/Profile/ProfilePage";
import { SignUpPage } from "./page/SignUp/SignUpPage";
import { LoginPage } from "./page/LogIn/LoginPage";
import { TrainingVideoPage } from "./page/TrainingVideo/TrainingVideoPage";
import { PageLayout } from "./components/PageLayout/PageLayout";
import { ProtectedRoute } from "./components/ProtectedRoute";
import useCourses from "./hooks/useCourses"; // Импортируем хук для загрузки курсов

/**
 * Компонент маршрутизации приложения.
 */
export const AppRoutes = () => {
  const { courses, loading, error } = useCourses(); // Загружаем данные курсов

  if (loading) {
    return <div>Загрузка курсов...</div>; // Отображаем загрузку, пока данные не загружены
  }

  if (error) {
    return <div>Ошибка: {error}</div>; // Отображаем ошибку, если она возникла
  }

  return (
    <Routes>
      {/* Главная страница доступна всем */}
      <Route index element={<MainPage courses={courses} />} />

      {/* Общий макет для страниц, которые используют PageLayout */}
      <Route path="/" element={<PageLayout />}>
        {/* Страница курса доступна всем */}
        <Route
          path="courses/:_id"
          element={<TrainingPage courses={courses} />}
        />

        {/* Защищённые маршруты */}
        <Route element={<ProtectedRoute redirectPath="/login" />}>
          {/* Страница с видео тренировки доступна только авторизованным пользователям */}
          <Route
            path="training-video/:courseId/:workoutId"
            element={<TrainingVideoPage />}
          />

          {/* Страница профиля доступна только авторизованным пользователям */}
          <Route path="profile" element={<ProfilePage courses={courses} />} />
        </Route>
      </Route>

      {/* Страницы регистрации и входа доступны всем */}
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* Страница 404 (не найдено) */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
