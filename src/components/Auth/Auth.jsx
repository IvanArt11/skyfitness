import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import * as S from "./styles.js";
import { useEffect, useState } from "react";
import { setUser } from "../../store/slices/userSlice";
import { useDispatch } from "react-redux";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

export default function AuthPage({ isLoginMode = false }) {
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [disable, setDisable] = useState(false);
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const validateLogin = () => {
    if (!email || !password) {
      setError("Заполните все поля");
      return false;
    }
    setError(null);
    return true;
  };

  const validateRegistration = () => {
    if (!email || !password || !repeatPassword) {
      setError("Заполните все поля");
      return false;
    }
    if (password !== repeatPassword) {
      setError("Пароли не совпадают");
      return false;
    }
    setError(null);
    return true;
  };

  const loginUser = async (email, password) => {
    if (!validateLogin()) return;

    const auth = getAuth();
    setDisable(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", JSON.stringify(user.accessToken));
      console.log("user ->", user);
      dispatch(
        setUser({
          email: user.email,
          id: user.uid,
          token: user.accessToken,
        })
      );
      navigate("/");
    } catch (error) {
      // Обработка ошибок Firebase
      switch (error.code) {
        case "auth/user-not-found":
          setError("Пользователь с такой почтой не найден.");
          break;
        case "auth/wrong-password":
          setError("Неверный пароль.");
          break;
        case "auth/too-many-requests":
          setError("Слишком много попыток. Попробуйте позже.");
          break;
        default:
          setError("Ошибка при авторизации: " + error.message);
          break;
      }
    } finally {
      setDisable(false);
    }
  };

  const registerUser = async (email, password, repeatPassword) => {
    if (!validateRegistration()) return;

    const auth = getAuth();
    setDisable(true);
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", JSON.stringify(user.accessToken));
      console.log("user ->", user);
      dispatch(
        setUser({
          email: user.email,
          id: user.uid,
          token: user.accessToken,
        })
      );
      navigate("/");
    } catch (error) {
      // Обработка ошибок Firebase
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("Пользователь с такой почтой уже зарегистрирован.");
          break;
        case "auth/weak-password":
          setError("Пароль слишком слабый.");
          break;
        default:
          setError("Ошибка при регистрации: " + error.message);
          break;
      }
    } finally {
      setDisable(false);
    }
  };

  useEffect(() => {
    setError(null);
  }, [isLoginMode, email, password, repeatPassword]);

  return (
    <S.PageContainer>
      <S.ModalForm>
        <Link to="/login">
          <S.ModalLogo>
            <S.ModalLogoImage src="/img/logo-dark.svg" alt="logo" />
          </S.ModalLogo>
        </Link>
        {isLoginMode ? (
          <>
            <S.Inputs>
              <S.ModalInput
                type="text"
                name="login"
                placeholder="Логин"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <S.ModalInput
                type="password"
                name="password"
                placeholder="Пароль"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </S.Inputs>
            {error && <S.Error>{error}</S.Error>}
            <S.Buttons>
              {disable ? (
                <p style={{ color: "#000" }}>Выполняется вход...</p>
              ) : (
                <S.PrimaryButton onClick={() => loginUser(email, password)}>
                  Войти
                </S.PrimaryButton>
              )}
              <Link to="/signup">
                <S.SecondaryButton>Зарегистрироваться</S.SecondaryButton>
              </Link>
            </S.Buttons>
          </>
        ) : (
          <>
            <S.Inputs>
              <S.ModalInput
                type="text"
                name="login"
                placeholder="Почта"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <S.ModalInput
                type="password"
                name="password"
                placeholder="Пароль"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <S.ModalInput
                type="password"
                name="repeat-password"
                placeholder="Повторите пароль"
                value={repeatPassword}
                onChange={(event) => setRepeatPassword(event.target.value)}
              />
            </S.Inputs>
            {error && <S.Error>{error}</S.Error>}
            <S.Buttons>
              {disable ? (
                <p style={{ color: "#000" }}>Регистрируем пользователя...</p>
              ) : (
                <S.PrimaryButton
                  onClick={() => registerUser(email, password, repeatPassword)}
                >
                  Зарегистрироваться
                </S.PrimaryButton>
              )}

              <p style={{ color: "#000" }}>
                Уже есть аккаунт?{" "}
                <Link to="/login">
                  <S.linkSingUp>Войти</S.linkSingUp>
                </Link>
              </p>
            </S.Buttons>
          </>
        )}
      </S.ModalForm>
    </S.PageContainer>
  );
}
