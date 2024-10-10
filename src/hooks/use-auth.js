import { useSelector } from "react-redux";

export function useAuth() {
  const { login, password, email, token, id } = useSelector(
    (state) => state.user
  );

  return {
    isAuth: !!id,
    login,
    password,
    email,
    token,
    id,
  };
}
