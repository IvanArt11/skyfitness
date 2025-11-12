import * as S from "./styles.js";
import { useEffect, useState } from "react";
import {
  getAuth,
  updatePassword,
  updateProfile,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function ChangeAuthPage({ isLoginChange = false }) {
  // Состояния для управления формой и ошибками
  const [error, setError] = useState(null); // Состояние для хранения ошибок
  const [success, setSuccess] = useState(null); // Состояние для успешных сообщений
  const [login, setLogin] = useState(""); // Состояние для нового логина
  const [password, setPassword] = useState(""); // Состояние для нового пароля
  const [repeatPassword, setRepeatPassword] = useState(""); // Состояние для повторного пароля
  const [currentPassword, setCurrentPassword] = useState(""); // Состояние для текущего пароля (подтверждение)
  const [disable, setDisable] = useState(false); // Состояние для блокировки кнопок во время загрузки
  const [showPassword, setShowPassword] = useState(false); // Состояние для отображения/скрытия нового пароля
  const [showRepeatPassword, setShowRepeatPassword] = useState(false); // Состояние для отображения/скрытия повторного пароля
  const [showCurrentPassword, setShowCurrentPassword] = useState(false); // Состояние для отображения/скрытия текущего пароля

  const navigate = useNavigate(); // Хук для навигации
  const auth = getAuth(); // Получаем экземпляр аутентификации Firebase
  const user = auth.currentUser; // Получаем текущего пользователя

  // Проверка аутентификации пользователя при загрузке компонента
  useEffect(() => {
    if (!user) {
      setError("Для изменения данных необходимо войти в систему");
      // Перенаправляем на страницу входа через 2 секунды
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      return;
    }

    // Если пользователь аутентифицирован, устанавливаем текущий логин
    if (user.displayName) {
      setLogin(user.displayName);
    }
  }, [user, navigate]);

  // Функция для повторной аутентификации пользователя (требуется Firebase для критических операций)
  const reauthenticateUser = async (currentPassword) => {
    if (!user || !user.email) {
      throw new Error("Пользователь не аутентифицирован");
    }

    // Создаем credential для повторной аутентификации
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );

    try {
      await reauthenticateWithCredential(user, credential);
      return true;
    } catch (error) {
      console.error("Ошибка повторной аутентификации:", error);
      throw error;
    }
  };

  // Функция для изменения логина (displayName)
  const handleLoginChange = async () => {
    // Валидация поля логина
    if (!login.trim()) {
      setError("Заполните поле логина!");
      return;
    }

    if (login.length < 2) {
      setError("Логин должен содержать минимум 2 символа");
      return;
    }

    if (login === user.displayName) {
      setError("Новый логин совпадает с текущим");
      return;
    }

    setDisable(true); // Блокируем кнопку
    setError(null); // Сбрасываем ошибки
    setSuccess(null); // Сбрасываем успешные сообщения

    try {
      // Обновляем профиль пользователя в Firebase
      await updateProfile(user, {
        displayName: login.trim(),
      });

      // Обновляем данные в localStorage
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      userData.displayName = login.trim();
      localStorage.setItem("user", JSON.stringify(userData));

      // Обновляем историю регистраций если она есть
      const registrations = JSON.parse(
        localStorage.getItem("userRegistrations") || "[]"
      );
      const currentUserRegistration = registrations.find(
        (reg) => reg.email === user.email
      );
      if (currentUserRegistration) {
        currentUserRegistration.username = login.trim();
        localStorage.setItem(
          "userRegistrations",
          JSON.stringify(registrations)
        );
      }

      setSuccess("Логин успешно изменен!");

      // Обновляем поле логина в состоянии
      setLogin(login.trim());

      // Сбрасываем успешное сообщение через 3 секунды
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Ошибка при изменении логина:", error);

      // Обработка ошибок Firebase
      switch (error.code) {
        case "auth/requires-recent-login":
          setError(
            "Для изменения логина требуется повторный вход. Введите текущий пароль для подтверждения."
          );
          break;
        case "auth/network-request-failed":
          setError("Ошибка сети. Проверьте подключение к интернету.");
          break;
        default:
          setError("Ошибка при изменении логина. Попробуйте еще раз.");
          break;
      }
    } finally {
      setDisable(false); // Разблокируем кнопку
    }
  };

  // Функция для изменения пароля
  const handlePasswordChange = async () => {
    // Валидация полей пароля
    if (!password || !repeatPassword || !currentPassword) {
      setError("Заполните все поля");
      return;
    }

    if (password !== repeatPassword) {
      setError("Новые пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    if (password === currentPassword) {
      setError("Новый пароль должен отличаться от текущего");
      return;
    }

    setDisable(true); // Блокируем кнопку
    setError(null); // Сбрасываем ошибки
    setSuccess(null); // Сбрасываем успешные сообщения

    try {
      // Повторная аутентификация пользователя перед критическим изменением
      await reauthenticateUser(currentPassword);

      // Обновляем пароль в Firebase
      await updatePassword(user, password);

      setSuccess("Пароль успешно изменен!");

      // Очищаем поля паролей после успешного изменения
      setPassword("");
      setRepeatPassword("");
      setCurrentPassword("");

      // Сбрасываем успешное сообщение через 3 секунды
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (error) {
      console.error("Ошибка при изменении пароля:", error);

      // Обработка ошибок Firebase
      switch (error.code) {
        case "auth/wrong-password":
          setError("Неверный текущий пароль");
          break;
        case "auth/weak-password":
          setError("Пароль слишком слабый. Используйте более сложный пароль.");
          break;
        case "auth/requires-recent-login":
          setError(
            "Требуется повторный вход. Войдите заново и попробуйте снова."
          );
          break;
        case "auth/network-request-failed":
          setError("Ошибка сети. Проверьте подключение к интернету.");
          break;
        default:
          setError("Ошибка при изменении пароля. Попробуйте еще раз.");
          break;
      }
    } finally {
      setDisable(false); // Разблокируем кнопку
    }
  };

  // Функция для отмены изменений и возврата назад
  const handleCancel = () => {
    navigate(-1); // Возврат на предыдущую страницу
  };

  // Сброс ошибок и сообщений при изменении полей формы
  useEffect(() => {
    setError(null);
    setSuccess(null);
  }, [isLoginChange, login, password, repeatPassword, currentPassword]);

  // Если пользователь не аутентифицирован, показываем сообщение
  if (!user) {
    return (
      <S.PageContainer>
        <S.ModalForm>
          <S.ModalLogo>
            <S.ModalLogoImage src="/img/logo-dark.svg" alt="logo" />
          </S.ModalLogo>
          <S.Error>
            {error ||
              "Пользователь не аутентифицирован. Перенаправление на страницу входа..."}
          </S.Error>
          <S.Buttons>
            <S.SecondaryButton onClick={() => navigate("/login")}>
              Перейти к входу
            </S.SecondaryButton>
          </S.Buttons>
        </S.ModalForm>
      </S.PageContainer>
    );
  }

  return (
    <S.PageContainer>
      <S.ModalForm>
        {/* Логотип */}
        <S.ModalLogo>
          <S.ModalLogoImage src="/img/logo-dark.svg" alt="logo" />
        </S.ModalLogo>

        {/* Заголовок в зависимости от режима */}
        <S.FormTitle>
          {isLoginChange ? "Изменение логина" : "Изменение пароля"}
        </S.FormTitle>

        {/* Информация о текущем пользователе */}
        <S.UserInfo>
          <S.InfoText>
            Текущий пользователь: <strong>{user.email}</strong>
          </S.InfoText>
          {user.displayName && (
            <S.InfoText>
              Текущий логин: <strong>{user.displayName}</strong>
            </S.InfoText>
          )}
        </S.UserInfo>

        {/* Условный рендеринг формы в зависимости от режима (изменение логина/пароля) */}
        {isLoginChange ? (
          <>
            {/* Форма изменения логина */}
            <S.Inputs>
              <S.ModalLabel>Новый логин:</S.ModalLabel>
              <S.ModalInput
                type="text"
                name="login"
                placeholder="Введите новый логин"
                value={login}
                onChange={(event) => {
                  setLogin(event.target.value);
                }}
                disabled={disable}
              />

              {/* Поле для текущего пароля (требуется для безопасности) */}
              <S.ModalLabel>Текущий пароль (для подтверждения):</S.ModalLabel>
              <S.PasswordInputContainer>
                <S.ModalInput
                  type={showCurrentPassword ? "text" : "password"}
                  name="current-password"
                  placeholder="Введите текущий пароль"
                  value={currentPassword}
                  onChange={(event) => {
                    setCurrentPassword(event.target.value);
                  }}
                  disabled={disable}
                />
                <S.ShowPasswordButton
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={disable}
                >
                  {showCurrentPassword ? "🙈" : "👁️"}
                </S.ShowPasswordButton>
              </S.PasswordInputContainer>
            </S.Inputs>

            {/* Подсказки по логину */}
            <S.HintInfo>
              💡 Логин будет отображаться в вашем профиле и может использоваться
              для идентификации
            </S.HintInfo>

            {/* Отображение ошибки, если она есть */}
            {error && <S.Error>{error}</S.Error>}

            {/* Отображение успешного сообщения, если оно есть */}
            {success && <S.SuccessMessage>{success}</S.SuccessMessage>}

            <S.Buttons>
              {/* Кнопка сохранения или индикатор загрузки */}
              {disable ? (
                <S.LoadingSpinner />
              ) : (
                <>
                  <S.PrimaryButton
                    onClick={handleLoginChange}
                    disabled={!login.trim() || !currentPassword || disable}
                  >
                    Сохранить логин
                  </S.PrimaryButton>
                  <S.SecondaryButton onClick={handleCancel}>
                    Отмена
                  </S.SecondaryButton>
                </>
              )}
            </S.Buttons>
          </>
        ) : (
          <>
            {/* Форма изменения пароля */}
            <S.Inputs>
              <S.ModalLabel>Текущий пароль:</S.ModalLabel>
              <S.PasswordInputContainer>
                <S.ModalInput
                  type={showCurrentPassword ? "text" : "password"}
                  name="current-password"
                  placeholder="Введите текущий пароль"
                  value={currentPassword}
                  onChange={(event) => {
                    setCurrentPassword(event.target.value);
                  }}
                  disabled={disable}
                />
                <S.ShowPasswordButton
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={disable}
                >
                  {showCurrentPassword ? "🙈" : "👁️"}
                </S.ShowPasswordButton>
              </S.PasswordInputContainer>

              <S.ModalLabel>Новый пароль:</S.ModalLabel>
              <S.PasswordInputContainer>
                <S.ModalInput
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Введите новый пароль"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value);
                  }}
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

              <S.ModalLabel>Повторите новый пароль:</S.ModalLabel>
              <S.PasswordInputContainer>
                <S.ModalInput
                  type={showRepeatPassword ? "text" : "password"}
                  name="repeat-password"
                  placeholder="Повторите новый пароль"
                  value={repeatPassword}
                  onChange={(event) => {
                    setRepeatPassword(event.target.value);
                  }}
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
            </S.Inputs>

            {/* Требования к паролю */}
            <S.PasswordRequirements>
              <S.InfoTitle>Требования к паролю:</S.InfoTitle>
              <S.InfoText>
                • Минимум 6 символов
                <br />
                • Рекомендуется использовать буквы, цифры и специальные символы
                <br />• Не используйте простые или легко угадываемые пароли
              </S.InfoText>
            </S.PasswordRequirements>

            {/* Отображение ошибки, если она есть */}
            {error && <S.Error>{error}</S.Error>}

            {/* Отображение успешного сообщения, если оно есть */}
            {success && <S.SuccessMessage>{success}</S.SuccessMessage>}

            <S.Buttons>
              {/* Кнопка сохранения или индикатор загрузки */}
              {disable ? (
                <S.LoadingSpinner />
              ) : (
                <>
                  <S.PrimaryButton
                    onClick={handlePasswordChange}
                    disabled={
                      !password ||
                      !repeatPassword ||
                      !currentPassword ||
                      disable
                    }
                  >
                    Сохранить пароль
                  </S.PrimaryButton>
                  <S.SecondaryButton onClick={handleCancel}>
                    Отмена
                  </S.SecondaryButton>
                </>
              )}
            </S.Buttons>

            {/* Предупреждение о безопасности */}
            <S.SecurityWarning>
              <S.SupportTitle>🔒 Важная информация:</S.SupportTitle>
              <S.SupportText>
                • После изменения пароля вам потребуется войти заново на всех
                устройствах
                <br />
                • Убедитесь, что вы запомнили новый пароль
                <br />• Рекомендуется использовать менеджер паролей для
                безопасного хранения
              </S.SupportText>
            </S.SecurityWarning>
          </>
        )}
      </S.ModalForm>
    </S.PageContainer>
  );
}
