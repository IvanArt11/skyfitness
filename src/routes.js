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

/**
 * Компонент маршрутизации приложения.
 * @param {Object} courses - Данные курсов, передаваемые в компоненты
 */
export const AppRoutes = ({ courses }) => {
  return (
    <Routes>
      {/* Главная страница доступна всем */}
      <Route index element={<MainPage courses={courses} />} />

      {/* Общий макет для страниц, которые используют PageLayout */}
      <Route path="/" element={<PageLayout />}>
        {/* Страница курса доступна всем */}
        <Route
          path="courses/:id"
          element={<TrainingPage courses={courses} />}
        />

        {/* Защищённые маршруты */}
        <Route element={<ProtectedRoute redirectPath="/login" />}>
          {/* Страница с видео тренировки доступна только авторизованным пользователям */}
          <Route path="training-video/:id" element={<TrainingVideoPage />} />

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
