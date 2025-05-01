/**
 * Компонент страницы профиля пользователя
 * Отображает информацию о пользователе, его курсы и позволяет редактировать данные
 */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as S from "./style"; // Импорт стилей из styled-components
import { useDispatch, useSelector } from "react-redux";
import {
  setNewLogin,
  setNewPassword,
  removeCourse,
  setUserCourses,
} from "../../store/slices/userSlice";
import { useAuth } from "../../hooks/use-auth"; // Кастомный хук для работы с авторизацией
import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";
import {
  doc,
  getDoc,
  updateDoc,
  arrayRemove,
  onSnapshot,
  deleteField,
} from "firebase/firestore";
import { db } from "../../firebase"; // Инициализированный экземпляр Firestore
import { enableIndexedDbPersistence } from "firebase/firestore";

/**
 * Включаем оффлайн-поддержку Firestore
 * Это позволит приложению работать без интернета,
 * используя локально сохраненные данные
 */
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.warn("Оффлайн-режим недоступен при нескольких вкладках");
  } else if (err.code === "unimplemented") {
    console.warn("Браузер не поддерживает оффлайн-режим");
  }
});

export const ProfilePage = () => {
  // Состояния для управления модальными окнами
  const [openEditLogin, setOpenEditLogin] = useState(false);
  const [openFormOldPassword, setOpenFormOldPassword] = useState(false);
  const [openEditPassword, setOpenEditPassword] = useState(false);

  // Состояние загрузки данных
  const [loading, setLoading] = useState(true);

  // Новое состояние для отслеживания удаляемого курса
  const [removingCourseId, setRemovingCourseId] = useState(null);

  // Состояние для отслеживания оффлайн-режима
  const [offlineMode, setOfflineMode] = useState(false);

  // Состояние для хранения ошибок
  const [error, setError] = useState(null);

  // Получаем данные аутентифицированного пользователя через кастомный хук
  const { email, login, password, id: userId } = useAuth();

  // Получаем функцию dispatch для работы с Redux store
  const dispatch = useDispatch();

  // Получаем курсы и прогресс пользователя из Redux store
  const { courses, progress } = useSelector((state) => state.user);

  /**
   * Эффект для загрузки данных пользователя при монтировании компонента
   * и при изменении userId
   */
  useEffect(() => {
    if (!userId) return; // Если нет userId, выходим

    let unsubscribe; // Функция для отписки от обновлений

    /**
     * Функция загрузки данных пользователя
     */
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userRef = doc(db, "users", userId);

        // Подписываемся на изменения документа пользователя
        unsubscribe = onSnapshot(
          userRef,
          // Обработчик успешного получения данных
          (doc) => {
            if (doc.exists()) {
              const userData = doc.data();
              // Обновляем данные в Redux store
              dispatch(
                setUserCourses({
                  courses: userData.courses || [],
                  progress: userData.progress || {},
                })
              );
              // Сохраняем данные в localStorage для оффлайн-режима
              localStorage.setItem(
                `userData_${userId}`,
                JSON.stringify(userData)
              );
              setOfflineMode(false);
            }
          },
          // Обработчик ошибок подписки
          (error) => {
            console.error("Ошибка подписки:", error);
            handleFirestoreError(error);
          }
        );
      } catch (error) {
        console.error("Ошибка загрузки:", error);
        handleFirestoreError(error);
      } finally {
        setLoading(false);
      }
    };

    /**
     * Функция обработки ошибок Firestore
     * @param {Error} error - Объект ошибки
     */
    const handleFirestoreError = (error) => {
      // Обработка ошибки отсутствия соединения
      if (error.code === "unavailable" || error.message.includes("offline")) {
        setOfflineMode(true);
        // Пробуем загрузить данные из localStorage
        const cachedData = localStorage.getItem(`userData_${userId}`);
        if (cachedData) {
          dispatch(setUserCourses(JSON.parse(cachedData)));
          setError("Оффлайн-режим. Используются кэшированные данные.");
        } else {
          setError("Оффлайн-режим. Нет кэшированных данных.");
        }
      }
      // Обработка ошибки доступа
      else if (error.code === "permission-denied") {
        setError("Нет доступа к данным. Войдите снова.");
      }
      // Обработка прочих ошибок
      else {
        setError("Ошибка загрузки данных");
      }
    };

    /**
     * Функция обработки изменения состояния сети
     */
    const handleNetworkChange = () => {
      if (navigator.onLine) {
        // При восстановлении соединения пробуем обновить данные
        fetchUserData();
      } else {
        setOfflineMode(true);
      }
    };

    // Первоначальная загрузка данных
    fetchUserData();

    // Добавляем обработчики изменения состояния сети
    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);

    // Функция очистки эффекта
    return () => {
      // Отписываемся от обновлений Firestore
      if (unsubscribe) unsubscribe();
      // Удаляем обработчики событий сети
      window.removeEventListener("online", handleNetworkChange);
      window.removeEventListener("offline", handleNetworkChange);
    };
  }, [userId, dispatch]); // Зависимости эффекта

  /**
   * Функция удаления курса
   * @param {string} courseId - ID курса для удаления
   */
  const handleRemoveCourse = async (courseId) => {
    if (!userId) return;

    try {
      setRemovingCourseId(courseId); // Устанавливаем курс, который удаляем
      setError(null);

      const userRef = doc(db, "users", userId);
      // Находим курс для удаления
      const courseToRemove = courses.find((c) => c._id === courseId);

      // Обновляем документ пользователя в Firestore
      await updateDoc(userRef, {
        courses: arrayRemove(courseToRemove), // Удаляем курс из массива
        [`progress.${courseId}`]: deleteField(), // Полное удаление прогресса
      });

      if (!courseToRemove) {
        throw new Error("Курс не найден");
      }

      // Обновляем состояние в Redux
      dispatch(removeCourse(courseId));
    } catch (error) {
      console.error("Ошибка удаления курса:", error);
      setError(
        error.code === "unavailable"
          ? "Изменения будут сохранены при восстановлении соединения"
          : "Не удалось удалить курс"
      );
    } finally {
      setRemovingCourseId(null); // Сбрасываем состояние загрузки
    }
  };

  /**
   * Функция расчета прогресса по курсу
   * @param {string} courseId - ID курса
   * @returns {number} Процент завершения курса (0-100)
   */
  const getCourseProgress = (courseId) => {
    if (!progress[courseId]) return 0;

    // Количество завершенных тренировок
    const completed = progress[courseId].completedWorkouts?.length || 0;
    // Общее количество тренировок в курсе
    const total =
      courses.find((c) => c._id === courseId)?.workouts?.length || 1;

    // Возвращаем процент завершения
    return Math.round((completed / total) * 100);
  };

  // Отображаем загрузку, если данные еще не получены
  if (loading) {
    return <S.Loading>Загрузка данных...</S.Loading>;
  }

  // Отображаем ошибку, если она есть и мы не в оффлайн-режиме
  if (error && !offlineMode) {
    return <S.ErrorMessage>{error}</S.ErrorMessage>;
  }

  // Основной рендер компонента
  return (
    <>
      {/* Баннер оффлайн-режима */}
      {offlineMode && (
        <S.OfflineWarning>
          ⚠️ Вы в оффлайн-режиме. Некоторые данные могут быть неактуальными.
        </S.OfflineWarning>
      )}

      {/* Модальные окна для редактирования данных */}
      {openEditLogin && <NewLoginForm setOpenEditLogin={setOpenEditLogin} />}
      {openFormOldPassword && (
        <OldPasswordForm
          setOpenFormOldPassword={setOpenFormOldPassword}
          setOpenEditPassword={setOpenEditPassword}
        />
      )}
      {openEditPassword && (
        <NewPasswordForm setOpenEditPassword={setOpenEditPassword} />
      )}

      {/* Блок с информацией о профиле */}
      <S.ProfileBlock>
        <S.Title>Профиль</S.Title>
        <S.ProfileContainer>
          <S.ProfileAvatarImg src="/img/avatar1.svg" alt="Аватар" />
          <S.InfoContainer>
            <S.InfoBlock>
              <S.TextInfo>Логин: {login || email}</S.TextInfo>
              <S.TextInfo>
                Пароль: {password ? "••••••••" : "●●●●●●●●"}
              </S.TextInfo>
            </S.InfoBlock>
            <S.ButtonBlock>
              <S.Button onClick={() => setOpenEditLogin(true)}>
                Редактировать логин
              </S.Button>
              <S.Button onClick={() => setOpenFormOldPassword(true)}>
                Редактировать пароль
              </S.Button>
            </S.ButtonBlock>
          </S.InfoContainer>
        </S.ProfileContainer>
      </S.ProfileBlock>

      {/* Блок с курсами пользователя */}
      <S.CourseBlock>
        <S.Title>Мои курсы</S.Title>
        {courses?.length > 0 ? (
          <S.CourseItems>
            {courses.map((course) => {
              if (!course?._id) return null; // Пропускаем курсы без ID

              // Рассчитываем прогресс по курсу
              const progressPercent = getCourseProgress(course._id);
              // Текст кнопки в зависимости от прогресса
              const buttonText =
                progressPercent === 0
                  ? "Начать тренировки"
                  : progressPercent === 100
                    ? "Пройти заново"
                    : "Продолжить";

              return (
                <S.SectionTraining key={course._id}>
                  {/* Кнопка удаления курса */}
                  <S.RemoveButton
                    onClick={() => handleRemoveCourse(course._id)}
                    $isAdded={true}
                    title="Удалить курс"
                    disabled={removingCourseId === course._id} // Блокируем кнопку при удалении
                  >
                    {removingCourseId === course._id ? (
                      <S.LoadingSpinner /> // Показываем индикатор загрузки
                    ) : (
                      <S.AddedIcon src="/img/added-icon.svg" alt="Удалить" />
                    )}
                  </S.RemoveButton>

                  {/* Изображение курса */}
                  <S.ImgTraining
                    src={`/img/card-course/card-${course.nameEN}.jpg`}
                    alt={course.nameRU}
                  />

                  {/* Информация о курсе */}
                  <S.TrainingContainer>
                    <S.TitleTraining>{course.nameRU}</S.TitleTraining>
                    <S.InfoItems>
                      <S.InfoItem>
                        <S.InfoIcon
                          src="/img/calendar-icon.svg"
                          alt="Длительность"
                        />
                        <S.InfoText>25 дней</S.InfoText>
                      </S.InfoItem>
                      <S.InfoItem>
                        <S.InfoIcon src="/img/clock-icon.svg" alt="Время" />
                        <S.InfoText>20-50 мин/день</S.InfoText>
                      </S.InfoItem>
                      <S.InfoItem>
                        <S.InfoIcon
                          src="/img/difficulty-icon.svg"
                          alt="Сложность"
                        />
                        <S.InfoText>Сложность</S.InfoText>
                      </S.InfoItem>
                    </S.InfoItems>

                    {/* Прогресс-бар */}
                    <div>
                      <S.ProgressHeader>
                        <span>Прогресс</span>
                        <S.ProgressPercent>
                          {progressPercent}%
                        </S.ProgressPercent>
                      </S.ProgressHeader>
                      <S.ProgressBar>
                        <S.ProgressBarFill $progress={progressPercent} />
                      </S.ProgressBar>
                    </div>

                    {/* <S.ProgressBar>
                      Прогресс
                      <S.ProgressBarFill $progress={progressPercent} />
                      <S.ProgressText>{progressPercent}%</S.ProgressText>
                    </S.ProgressBar> */}

                    {/* Кнопка перехода к тренировкам */}
                    <S.ProgressButton
                      as={Link}
                      to={`/training-video/${course._id}`}
                    >
                      {buttonText}
                    </S.ProgressButton>
                  </S.TrainingContainer>
                </S.SectionTraining>
              );
            })}
          </S.CourseItems>
        ) : (
          // Сообщение, если у пользователя нет курсов
          <S.NoCoursesMessage>
            Вы еще не записывались на курсы
          </S.NoCoursesMessage>
        )}
      </S.CourseBlock>

      {/* Ссылка на страницу со всеми курсами */}
      <S.viewAllCourses as={Link} to={"/"}>
        Все курсы
      </S.viewAllCourses>
      {/* <Link to={"/"}>
        <S.viewAllCourses>Все курсы</S.viewAllCourses>
      </Link> */}
    </>
  );
};

/**
 * Компонент формы для изменения логина
 */
const NewLoginForm = ({ setOpenEditLogin }) => {
  const dispatch = useDispatch();
  const { email, login } = useAuth();
  const [newLog, setNewLog] = useState(login || email);

  /**
   * Функция сохранения нового логина
   */
  const saveNewLogin = () => {
    dispatch(setNewLogin(newLog)); // Обновляем в Redux
    localStorage.setItem("login", JSON.stringify(newLog)); // Сохраняем в localStorage
    setOpenEditLogin(false); // Закрываем модальное окно
  };

  /**
   * Функция закрытия модального окна
   */
  const closeWindow = () => {
    document.body.style.overflow = null; // Восстанавливаем прокрутку страницы
    setOpenEditLogin(false);
  };

  return (
    <S.BlackoutWrapper onClick={closeWindow}>
      <S.PopupLogin onClick={(e) => e.stopPropagation()}>
        <S.closeWindow
          src="/img/close.svg"
          onClick={closeWindow}
          alt="Закрыть"
        />
        <S.LoginLogo>
          <img width={220} height={35} src="img/logo-dark.svg" alt="Логотип" />
        </S.LoginLogo>
        <S.Inputs>
          <S.TitleInput>Новый логин:</S.TitleInput>
          <S.Input
            type="text"
            placeholder="Логин"
            value={newLog}
            onChange={(e) => setNewLog(e.target.value)}
          />
        </S.Inputs>
        <S.Button disabled={!newLog.trim()} onClick={saveNewLogin}>
          Сохранить
        </S.Button>
      </S.PopupLogin>
    </S.BlackoutWrapper>
  );
};

/**
 * Компонент формы для ввода старого пароля
 */
const OldPasswordForm = ({ setOpenFormOldPassword, setOpenEditPassword }) => {
  const [oldPass, setOldPass] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);

  /**
   * Функция проверки старого пароля
   */
  const checkOldPassword = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    // Создаем credentials для аутентификации
    const credential = EmailAuthProvider.credential(user.email, oldPass);

    try {
      // Пробуем переаутентифицировать пользователя
      await reauthenticateWithCredential(user, credential);
      setOpenFormOldPassword(false);
      setOpenEditPassword(true); // Открываем форму нового пароля
    } catch (error) {
      setErrorPassword(true); // Показываем ошибку, если пароль неверный
    }
  };

  /**
   * Функция закрытия модального окна
   */
  const closeWindow = () => {
    document.body.style.overflow = null;
    setOpenFormOldPassword(false);
  };

  return (
    <S.BlackoutWrapper onClick={closeWindow}>
      <S.PopupLogin onClick={(e) => e.stopPropagation()}>
        <S.closeWindow
          src="/img/close.svg"
          onClick={closeWindow}
          alt="Закрыть"
        />
        <S.LoginLogo>
          <img width={220} height={35} src="img/logo-dark.svg" alt="Логотип" />
        </S.LoginLogo>
        <S.Inputs>
          <S.TitleInput>Введите старый пароль:</S.TitleInput>
          <S.Input
            type="password"
            placeholder="Старый пароль"
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
          />
        </S.Inputs>
        {errorPassword && <S.ErrorText>Неверный пароль</S.ErrorText>}
        <S.Button disabled={!oldPass.trim()} onClick={checkOldPassword}>
          Далее
        </S.Button>
      </S.PopupLogin>
    </S.BlackoutWrapper>
  );
};

/**
 * Компонент формы для ввода нового пароля
 */
const NewPasswordForm = ({ setOpenEditPassword }) => {
  const dispatch = useDispatch();
  const [newPass, setNewPass] = useState("");
  const [repeatNewPass, setRepeatNewPass] = useState("");

  /**
   * Функция сохранения нового пароля
   */
  const saveNewPassword = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      // Обновляем пароль в Firebase Auth
      await updatePassword(user, newPass);
      dispatch(setNewPassword(newPass)); // Обновляем в Redux
      setOpenEditPassword(false); // Закрываем модальное окно
    } catch (error) {
      console.error("Ошибка при смене пароля:", error);
    }
  };

  /**
   * Функция закрытия модального окна
   */
  const closeWindow = () => {
    document.body.style.overflow = null;
    setOpenEditPassword(false);
  };

  return (
    <S.BlackoutWrapper onClick={closeWindow}>
      <S.PopupPassword onClick={(e) => e.stopPropagation()}>
        <S.closeWindow
          src="/img/close.svg"
          onClick={closeWindow}
          alt="Закрыть"
        />
        <S.LoginLogo>
          <img width={220} height={35} src="img/logo-dark.svg" alt="Логотип" />
        </S.LoginLogo>
        <S.Inputs>
          <S.TitleInput>Новый пароль:</S.TitleInput>
          <S.Input
            type="password"
            placeholder="Пароль"
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
          <S.Input
            type="password"
            placeholder="Повторите пароль"
            value={repeatNewPass}
            onChange={(e) => setRepeatNewPass(e.target.value)}
          />
        </S.Inputs>
        {newPass !== repeatNewPass ? (
          <S.WarningMessage>Пароли не совпадают</S.WarningMessage>
        ) : (
          <S.Button
            disabled={!newPass.trim() || !repeatNewPass.trim()}
            onClick={saveNewPassword}
          >
            Сохранить
          </S.Button>
        )}
      </S.PopupPassword>
    </S.BlackoutWrapper>
  );
};
