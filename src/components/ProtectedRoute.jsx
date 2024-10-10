import { Navigate, Outlet } from "react-router-dom";

export const ProtectedRoute = ({ redirectPath }) => {
  if (!Boolean(localStorage.getItem("user"))) {
    return <Navigate to={redirectPath} replace={true} />;
  }

  return <Outlet />;
};
