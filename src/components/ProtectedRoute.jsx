import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/use-auth"; // Используем контекст для проверки авторизации

/**
 * Компонент для защиты маршрутов.
 * Если пользователь не авторизован, перенаправляет на указанный путь.
 * @param {string} redirectPath - Путь для перенаправления (по умолчанию "/login")
 */
export const ProtectedRoute = ({ redirectPath = "/login" }) => {
  const { isAuth } = useAuth(); // Получаем состояние авторизации из контекста

  // Если пользователь не авторизован, перенаправляем на redirectPath
  if (!isAuth) {
    return <Navigate to={redirectPath} replace />;
  }

  // Если авторизован, отображаем дочерние маршруты
  return <Outlet />;
};
