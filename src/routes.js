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

// Компоненты с загрузкой данных только когда нужно
const MainPageWithCourses = () => {
  const { courses, loading, error } = useCourses();

  if (loading) return <div>Загрузка курсов...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return <MainPage courses={courses} />;
};

const TrainingPageWithCourses = () => {
  const { courses, loading, error } = useCourses();

  if (loading) return <div>Загрузка курсов...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return <TrainingPage courses={courses} />;
};

const ProfilePageWithCourses = () => {
  const { courses, loading, error } = useCourses();

  if (loading) return <div>Загрузка курсов...</div>;
  if (error) return <div>Ошибка: {error}</div>;

  return <ProfilePage courses={courses} />;
};

/**
 * Компонент маршрутизации приложения.
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Главная страница доступна всем */}
      <Route index element={<MainPageWithCourses />} />

      {/* Общий макет для страниц, которые используют PageLayout */}
      <Route path="/" element={<PageLayout />}>
        {/* Страница курса доступна всем */}
        <Route path="courses/:_id" element={<TrainingPageWithCourses />} />

        {/* Защищённые маршруты */}
        <Route element={<ProtectedRoute redirectPath="/login" />}>
          {/* Страница с видео тренировки доступна только авторизованным пользователям */}
          <Route
            path="training-video/:courseId/:workoutId"
            element={<TrainingVideoPage />}
          />

          {/* Страница профиля доступна только авторизованным пользователям */}
          <Route path="profile" element={<ProfilePageWithCourses />} />
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
