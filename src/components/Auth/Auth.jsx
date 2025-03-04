import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import * as S from "./styles.js";
import { setUser } from "../../store/slices/userSlice";

export default function AuthPage({ isLoginMode = false }) {
  // Состояния для управления формой и ошибками
  const [error, setError] = useState(null); // Состояние для хранения ошибок
  const [email, setEmail] = useState(""); // Состояние для email
  const [password, setPassword] = useState(""); // Состояние для пароля
  const [repeatPassword, setRepeatPassword] = useState(""); // Состояние для повторного пароля (регистрация)
  const [disable, setDisable] = useState(false); // Состояние для блокировки кнопок во время загрузки

  const navigate = useNavigate(); // Хук для навигации между страницами
  const dispatch = useDispatch(); // Хук для отправки действий в Redux

  // Функция для валидации email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  // Функция для валидации формы входа
  const validateLogin = () => {
    if (!email || !password) {
      setError("Заполните все поля");
      return false;
    }
    if (!validateEmail(email)) {
      setError("Введите корректный email");
      return false;
    }
    setError(null);
    return true;
  };

  // Функция для валидации формы регистрации
  const validateRegistration = () => {
    if (!email || !password || !repeatPassword) {
      setError("Заполните все поля");
      return false;
    }
    if (!validateEmail(email)) {
      setError("Введите корректный email");
      return false;
    }
    if (password !== repeatPassword) {
      setError("Пароли не совпадают");
      return false;
    }
    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return false;
    }
    setError(null);
    return true;
  };

  // Функция для входа пользователя
  const loginUser = async (email, password) => {
    if (!validateLogin()) return; // Проверка валидации перед входом

    const auth = getAuth();
    setDisable(true); // Блокировка кнопки во время запроса
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password); // Вход через Firebase
      localStorage.setItem("user", JSON.stringify(user)); // Сохранение данных пользователя в localStorage
      localStorage.setItem("token", JSON.stringify(user.accessToken)); // Сохранение токена
      dispatch(
        setUser({ email: user.email, id: user.uid, token: user.accessToken })
      ); // Обновление состояния пользователя в Redux
      navigate("/"); // Перенаправление на главную страницу
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
          // setError("Ошибка при авторизации: " + error.message);
          setError("Введены неверные логин или пароль.");
          break;
      }
    } finally {
      setDisable(false); // Разблокировка кнопки после завершения запроса
    }
  };

  // Функция для регистрации пользователя
  const registerUser = async (email, password, repeatPassword) => {
    if (!validateRegistration()) return; // Проверка валидации перед регистрацией

    const auth = getAuth();
    setDisable(true); // Блокировка кнопки во время запроса
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ); // Регистрация через Firebase
      localStorage.setItem("user", JSON.stringify(user)); // Сохранение данных пользователя в localStorage
      localStorage.setItem("token", JSON.stringify(user.accessToken)); // Сохранение токена
      dispatch(
        setUser({ email: user.email, id: user.uid, token: user.accessToken })
      ); // Обновление состояния пользователя в Redux
      navigate("/"); // Перенаправление на главную страницу
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
          // setError("Ошибка при регистрации: " + error.message);
          setError("Пользователь не зарегистрирован");
          break;
      }
    } finally {
      setDisable(false); // Разблокировка кнопки после завершения запроса
    }
  };

  // Сброс ошибки при изменении режима (вход/регистрация) или полей формы
  useEffect(() => {
    setError(null);
  }, [isLoginMode, email, password, repeatPassword]);

  return (
    <S.PageContainer>
      <S.ModalForm>
        {/* Логотип с ссылкой на страницу входа */}
        <Link to="/login">
          <S.ModalLogo>
            <S.ModalLogoImage src="/img/logo-dark.svg" alt="logo" />
          </S.ModalLogo>
        </Link>
        {/* Условный рендеринг формы в зависимости от режима (вход/регистрация) */}
        {isLoginMode ? (
          <>
            {/* Форма входа */}
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
            {/* Отображение ошибки, если она есть */}
            {error && <S.Error>{error}</S.Error>}
            <S.Buttons>
              {/* Кнопка входа или спиннер загрузки */}
              {disable ? (
                <S.LoadingSpinner />
              ) : (
                <S.PrimaryButton onClick={() => loginUser(email, password)}>
                  Войти
                </S.PrimaryButton>
              )}
              {/* Ссылка на страницу регистрации */}
              <Link to="/signup">
                <S.SecondaryButton>Зарегистрироваться</S.SecondaryButton>
              </Link>
            </S.Buttons>
          </>
        ) : (
          <>
            {/* Форма регистрации */}
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
            {/* Отображение ошибки, если она есть */}
            {error && <S.Error>{error}</S.Error>}
            <S.Buttons>
              {/* Кнопка регистрации или спиннер загрузки */}
              {disable ? (
                <S.LoadingSpinner />
              ) : (
                <S.PrimaryButton
                  onClick={() => registerUser(email, password, repeatPassword)}
                >
                  Зарегистрироваться
                </S.PrimaryButton>
              )}

              {/* Ссылка на страницу входа */}
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
