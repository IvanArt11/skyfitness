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

export const AppRoutes = ({ courses }) => {
  return (
    <Routes>
      <Route element={<ProtectedRoute redirectPath={"/login"} />}>
        <Route index element={<MainPage courses={courses} />} />
        <Route path="/" element={<PageLayout />}>
          <Route
            path="/courses/:id"
            element={<TrainingPage courses={courses} />}
          />
          <Route path="/training-video/:id" element={<TrainingVideoPage />} />
          <Route path="/profile" element={<ProfilePage courses={courses} />} />
        </Route>
        <Route path="/signup" element={<SignUpPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
