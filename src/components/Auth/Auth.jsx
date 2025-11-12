import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import * as S from "./styles.js";
import { setUser } from "../../store/slices/userSlice";

export default function AuthPage({ isLoginMode = false }) {
  // Состояния для управления формой и ошибками
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [disable, setDisable] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [username, setUsername] = useState("");
  const [registrationHint, setRegistrationHint] = useState("");

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
    if (!email || !password || !repeatPassword || !username) {
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
    if (username.length < 2) {
      setError("Имя пользователя должно содержать минимум 2 символа");
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

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          id: user.uid,
          displayName: user.displayName,
        })
      ); // Сохранение данных пользователя в localStorage
      localStorage.setItem("token", user.accessToken); // Сохранение токена

      const savedHint = localStorage.getItem("registrationHint");
      if (savedHint) {
        localStorage.setItem("currentUserHint", savedHint);
      }

      dispatch(
        setUser({
          email: user.email,
          id: user.uid,
          token: user.accessToken,
          displayName: user.displayName,
        })
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
        case "auth/invalid-credential":
          setError("Неверные учетные данные.");
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
  const registerUser = async (
    email,
    password,
    repeatPassword,
    username,
    hint
  ) => {
    if (!validateRegistration()) return; // Проверка валидации перед регистрацией

    const auth = getAuth();
    setDisable(true); // Блокировка кнопки во время запроса
    try {
      const { user } = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      ); // Регистрация через Firebase

      await updateProfile(user, {
        displayName: username,
      });

      localStorage.setItem(
        "user",
        JSON.stringify({
          email: user.email,
          id: user.uid,
          displayName: username,
        })
      ); // Сохранение данных пользователя в localStorage
      localStorage.setItem("token", user.accessToken); // Сохранение токена

      if (hint) {
        localStorage.setItem("registrationHint", hint);
        localStorage.setItem("currentUserHint", hint);
      }

      const registrations = JSON.parse(
        localStorage.getItem("userRegistrations") || "[]"
      );
      registrations.push({
        email: user.email,
        username: username,
        hint: hint,
        registeredAt: new Date().toISOString(),
      });
      localStorage.setItem("userRegistrations", JSON.stringify(registrations));

      dispatch(
        setUser({
          email: user.email,
          id: user.uid,
          token: user.accessToken,
          displayName: username,
        })
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
        case "auth/invalid-email":
          setError("Неверный формат email.");
          break;
        default:
          setError("Ошибка при регистрации. Попробуйте еще раз.");
          break;
      }
    } finally {
      setDisable(false);
    }
  };

  // Функция для восстановления пароля
  const handlePasswordReset = async () => {
    if (!email) {
      setError("Введите email для восстановления пароля");
      return;
    }

    if (!validateEmail(email)) {
      setError("Введите корректный email");
      return;
    }

    const auth = getAuth();
    setDisable(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setError(`Ссылка для востановления пароля отправлена на ${email}`);
      setTimeout(() => {
        setShowResetForm(false);
        setError(null);
      }, 5000);
    } catch (error) {
      switch (error.code) {
        case "auth/user-not-found":
          setError("Пользователь с таким email не найден");
          break;
        case "auth/invalid-email":
          setError("Неверный формат email");
          break;
        default:
          setError("Ошибка при восстановлении пароля");
          break;
      }
    } finally {
      setDisable(false); // Разблокировка кнопки после завершения запроса
    }
  };

  // Функция для поиска учетных данных по подсказке
  const findCredentialsByHint = () => {
    const registrations = JSON.parse(
      localStorage.getItem("userRegistrations") || "[]"
    );
    const foundRegistration = registrations.find(
      (reg) =>
        reg.hint &&
        reg.hint.toLowerCase().includes(registrationHint.toLowerCase())
    );

    if (foundRegistration) {
      setEmail(foundRegistration.email);
      setError(
        `Найден аккаунт: ${foundRegistration.email}. Введите пароль или восстановите его.`
      );
    } else {
      setError("Аккаунт с такой подсказкой не найден");
    }
  };

  // Сброс ошибки при изменении режима (вход/регистрация) или полей формы
  useEffect(() => {
    setError(null);
  }, [
    isLoginMode,
    email,
    password,
    repeatPassword,
    username,
    showResetForm,
    registrationHint,
  ]);

  // Рендеринг формы восстановления пароля
  if (showResetForm) {
    return (
      <S.PageContainer>
        <S.ModalForm>
          <S.ModalLogo>
            <S.ModalLogoImage src="/img/logo-dark.svg" alt="logo" />
          </S.ModalLogo>

          <S.FormTitle>Восстановление пароля</S.FormTitle>

          <S.Inputs>
            {/* Используем ModalLabel который теперь есть в styles.js */}
            <S.ModalLabel>Введите ваш email:</S.ModalLabel>
            <S.ModalInput
              type="email"
              placeholder="Ваш email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={disable}
            />
          </S.Inputs>

          {error &&
            (error.includes("отправлены") ? (
              <S.SuccessMessage>{error}</S.SuccessMessage>
            ) : (
              <S.Error>{error}</S.Error>
            ))}

          <S.Buttons>
            {disable ? (
              <S.LoadingSpinner />
            ) : (
              <>
                <S.PrimaryButton
                  onClick={handlePasswordReset}
                  disabled={!email}
                >
                  Восстановить пароль
                </S.PrimaryButton>
                <S.SecondaryButton onClick={() => setShowResetForm(false)}>
                  Назад к входу
                </S.SecondaryButton>
              </>
            )}
          </S.Buttons>

          <S.HintSection>
            <S.ModalLabel>Не помните email?</S.ModalLabel>
            <S.ModalInput
              type="text"
              placeholder="Введите вашу подсказку"
              value={registrationHint}
              onChange={(event) => setRegistrationHint(event.target.value)}
            />
            <S.SecondaryButton
              onClick={findCredentialsByHint}
              style={{ marginTop: "10px" }}
            >
              Найти аккаунт
            </S.SecondaryButton>
          </S.HintSection>
        </S.ModalForm>
      </S.PageContainer>
    );
  }

  // Основной рендеринг формы входа/регистрации
  return (
    <S.PageContainer>
      <S.ModalForm>
        {/* Логотип с ссылкой на страницу входа */}
        <Link to="/">
          <S.ModalLogo>
            <S.ModalLogoImage src="/img/logo-dark.svg" alt="logo" />
          </S.ModalLogo>
        </Link>

        {/* Условный рендеринг формы в зависимости от режима (вход/регистрация) */}
        {isLoginMode ? (
          <>
            {/* Форма входа */}
            <S.FormTitle>Вход в аккаунт</S.FormTitle>

            <S.Inputs>
              <S.ModalInput
                type="text"
                name="login"
                placeholder="Логин"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={disable}
              />

              <S.PasswordInputContainer>
                <S.ModalInput
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={disable}
                />
                <S.ShowPasswordButton
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={disable}
                >
                  {showPassword ? "🙈" : "👁️"}
                </S.ShowPasswordButton>
              </S.PasswordInputContainer>
            </S.Inputs>

            <S.ForgotPasswordLink onClick={() => setShowResetForm(true)}>
              Забыли пароль?
            </S.ForgotPasswordLink>

            {localStorage.getItem("currentUserHint") && (
              <S.HintText>
                💡 Подсказка: {localStorage.getItem("currentUserHint")}
              </S.HintText>
            )}

            {/* Отображение ошибки, если она есть */}
            {error && <S.Error>{error}</S.Error>}

            <S.Buttons>
              {/* Кнопка входа или спиннер загрузки */}
              {disable ? (
                <S.LoadingSpinner />
              ) : (
                <S.PrimaryButton
                  onClick={() => loginUser(email, password)}
                  disabled={disable}
                >
                  Войти
                </S.PrimaryButton>
              )}
              {/* Ссылка на страницу регистрации */}
              <Link to="/signup">
                <S.SecondaryButton disabled={disable}>
                  Зарегистрироваться
                </S.SecondaryButton>
              </Link>
            </S.Buttons>

            <S.SupportSection>
              <S.SupportTitle>Проблемы со входом?</S.SupportTitle>
              <S.SupportText>
                • Проверьте правильность email и пароля
                <br />
                • Используйте подсказку выше если забыли данные
                <br />• Восстановите пароль если не можете войти
              </S.SupportText>
            </S.SupportSection>
          </>
        ) : (
          <>
            {/* Форма регистрации */}
            <S.FormTitle>Регистрация</S.FormTitle>

            <S.Inputs>
              <S.ModalInput
                type="text"
                name="username"
                placeholder="Имя пользователя"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                disabled={disable}
              />

              <S.ModalInput
                type="text"
                name="login"
                placeholder="Эл. почта"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={disable}
              />

              <S.PasswordInputContainer>
                <S.ModalInput
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Пароль"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  disabled={disable}
                />
                <S.ShowPasswordButton
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={disable}
                >
                  {showPassword ? "🙈" : "👁️"}
                </S.ShowPasswordButton>
              </S.PasswordInputContainer>

              <S.PasswordInputContainer>
                <S.ModalInput
                  type={showRepeatPassword ? "text" : "password"}
                  name="repeat-password"
                  placeholder="Повторите пароль"
                  value={repeatPassword}
                  onChange={(event) => setRepeatPassword(event.target.value)}
                  disabled={disable}
                />
                <S.ShowPasswordButton
                  type="button"
                  onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                  disabled={disable}
                >
                  {showRepeatPassword ? "🙈" : "👁️"}
                </S.ShowPasswordButton>
              </S.PasswordInputContainer>

              <S.ModalInput
                type="text"
                name="hint"
                placeholder="Подсказка для восстановления"
                value={registrationHint}
                onChange={(event) => setRegistrationHint(event.target.value)}
                disabled={disable}
              />
            </S.Inputs>

            <S.HintInfo>
              💡 Подсказка поможет вам вспомнить данные для входа, если забудете
              их
            </S.HintInfo>

            {/* Отображение ошибки, если она есть */}
            {error && <S.Error>{error}</S.Error>}

            <S.Buttons>
              {/* Кнопка регистрации или спиннер загрузки */}
              {disable ? (
                <S.LoadingSpinner />
              ) : (
                <S.PrimaryButton
                  onClick={() =>
                    registerUser(
                      email,
                      password,
                      repeatPassword,
                      username,
                      registrationHint
                    )
                  }
                  disabled={disable}
                >
                  Зарегистрироваться
                </S.PrimaryButton>
              )}

              {/* Ссылка на страницу входа */}
              <S.LoginRedirect>
                Уже есть аккаунт?{" "}
                <Link to="/login">
                  <S.LinkSingUp>Войти</S.LinkSingUp>
                </Link>
              </S.LoginRedirect>
            </S.Buttons>
          </>
        )}
      </S.ModalForm>
    </S.PageContainer>
  );
}
