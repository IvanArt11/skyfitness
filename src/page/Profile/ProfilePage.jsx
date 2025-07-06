/**
 * Компонент страницы профиля пользователя
 * Отображает информацию о пользователе, его курсы и позволяет редактировать данные
 */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as S from "./style";
import { useDispatch, useSelector } from "react-redux";
import {
  setNewLogin,
  setNewPassword,
  removeCourse,
  setUserCourses,
} from "../../store/slices/userSlice";
import { useAuth } from "../../hooks/use-auth";
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
  runTransaction,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../firebase"; // Инициализированный экземпляр Firestore
import { enableIndexedDbPersistence } from "firebase/firestore";
import { WorkoutSelectionModal } from "../../components/WorkoutSelectionModal/WorkoutSelectionModal";

// Включаем оффлайн-поддержку Firestore с обработкой возможных ошибок
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code === "failed-precondition") {
    console.warn("Оффлайн-режим недоступен при нескольких вкладках");
  } else if (err.code === "unimplemented") {
    console.warn("Браузер не поддерживает оффлайн-режим");
  }
});

export const ProfilePage = () => {
  const navigate = useNavigate();
  // Получаем функцию dispatch для работы с Redux store
  const dispatch = useDispatch();

  // Состояния для управления модальными окнами
  const [openEditLogin, setOpenEditLogin] = useState(false);
  const [openFormOldPassword, setOpenFormOldPassword] = useState(false);
  const [openEditPassword, setOpenEditPassword] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showWorkoutSelection, setShowWorkoutSelection] = useState(false);
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
  // Получаем курсы и прогресс пользователя из Redux store
  const { courses, progress } = useSelector((state) => state.user);

  // Логирование состояния
  console.log("Profile state:", {
    userId,
    coursesCount: courses?.length,
    offlineMode,
    loading,
  });

  /**
   * Обработчик открытия модального окна выбора тренировки
   * @param {Object} course - Объект курса
   */
  const handleWorkoutButtonClick = (course) => {
    if (!course?._id) {
      console.error("Invalid course object:", course);
      setError("Неверный объект курса");
      return;
    }
    setSelectedCourse(course);
    setShowWorkoutSelection(true);
  };

  /**
   * Закрытие модального окна выбора тренировки
   */
  const handleCloseWorkoutModal = () => {
    setShowWorkoutSelection(false);
  };

  /**
   * Обработчик выбора конкретной тренировки
   * @param {Object} workout - Выбранная тренировка
   */
  const handleWorkoutSelect = (workout) => {
    if (!workout?._id || !selectedCourse?._id) {
      console.error("Недостаточно данных для перехода:", {
        workout,
        selectedCourse,
      });
      setError("Не удалось определить тренировку");
      return;
    }

    console.log("Переход на тренировку:", {
      courseId: selectedCourse._id,
      workoutId: workout._id,
    });

    navigate(`/training-video/${selectedCourse._id}/${workout._id}`);
    setShowWorkoutSelection(false);
  };

  // Эффект для загрузки и отслеживания данных пользователя
  useEffect(() => {
    if (!userId) {
      console.warn("No userId, skipping data fetch");
      setLoading(false);
      return; // Если нет userId, выходим
    }

    let unsubscribe; // Функция для отписки от обновлений

    /**
     * Загрузка данных пользователя из Firestore
     */
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        const userRef = doc(db, "users", userId);
        console.log("Fetching user data for:", userId);

        // Подписываемся на изменения документа пользователя
        unsubscribe = onSnapshot(
          userRef,
          // Обработчик успешного получения данных
          (doc) => {
            if (doc.exists()) {
              const userData = doc.data();
              console.log("Received user data:", userData);
              // Обновляем данные в Redux store
              dispatch(
                setUserCourses({
                  courses: userData.courses || [],
                  progress: userData.progress || {},
                })
              );
              // Кэшируем данные для оффлайн-режима
              localStorage.setItem(
                `userData_${userId}`,
                JSON.stringify(userData)
              );
              setOfflineMode(false);
            } else {
              console.log("User document does not exist, creating...");
              initializeUserDocument(userId);
            }
          },
          // Обработчик ошибок подписки
          (error) => handleFirestoreError(error)
        );
      } catch (error) {
        handleFirestoreError(error);
      } finally {
        setLoading(false);
      }
    };

    /**
     * Обработка ошибок Firestore
     * @param {Error} error - Объект ошибки
     */
    const initializeUserDocument = async (userId) => {
      try {
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, {
          courses: [],
          progress: {},
          createdAt: serverTimestamp(),
        });
        console.log("Created new user document");
      } catch (error) {
        console.error("Error creating user document:", error);
        handleFirestoreError(error);
      }
    };

    const handleFirestoreError = (error) => {
      console.error("Firestore error:", error);

      // Обработка оффлайн-режима
      if (error.code === "unavailable" || error.message.includes("offline")) {
        setOfflineMode(true);
        // Пробуем загрузить данные из localStorage
        const cachedData = localStorage.getItem(`userData_${userId}`);
        if (cachedData) {
          console.log("Using cached data in offline mode");
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
     * Обработчик изменения состояния сети
     */
    const handleNetworkChange = () => {
      console.log("Network status changed, online:", navigator.onLine);
      if (navigator.onLine) {
        fetchUserData(); // Повторная загрузка при восстановлении соединения
      } else {
        setOfflineMode(true);
      }
    };

    // Инициализация загрузки данных
    fetchUserData();

    // Обработчики изменения состояния сети
    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);

    // Очистка эффекта
    return () => {
      // Отписываемся от обновлений Firestore
      if (unsubscribe) unsubscribe();
      // Удаляем обработчики событий сети
      window.removeEventListener("online", handleNetworkChange);
      window.removeEventListener("offline", handleNetworkChange);
    };
  }, [userId, dispatch]); // Зависимости эффекта

  /**
   * Удаление курса из профиля пользователя
   * @param {string} courseId - ID курса для удаления
   */
  const handleRemoveCourse = async (courseId) => {
    console.log("Attempting to remove course", { userId, courseId, courses });

    if (!userId) {
      setError("Пользователь не авторизован");
      return;
    }

    if (!courseId || typeof courseId !== "string") {
      setError("Неверный ID курса");
      return;
    }

    // Проверка оффлайн-режима
    if (offlineMode) {
      setError("Удаление недоступно в оффлайн-режиме");
      return;
    }

    const courseToRemove = courses.find((c) => c._id === courseId);
    if (!courseToRemove) {
      setError("Курс не найден в вашем профиле");
      return;
    }

    const confirmRemove = window.confirm(
      `Вы уверены, что хотите удалить курс "${courseToRemove.nameRU}"?`
    );
    if (!confirmRemove) return;

    try {
      setRemovingCourseId(courseId); // Устанавливаем курс, который удаляем
      setError(null);

      const userRef = doc(db, "users", userId);
      const auth = getAuth();

      if (!auth.currentUser) {
        throw new Error("Требуется повторная авторизация");
      }

      // Используем транзакцию для безопасного обновления
      await runTransaction(db, async (transaction) => {
        const freshDoc = await transaction.get(userRef);
        if (!freshDoc.exists()) {
          console.log("User document missing, creating new one");
          transaction.set(userRef, {
            courses: [],
            progress: {},
            createdAt: serverTimestamp(),
          });
          throw new Error("Профиль был создан. Повторите удаление.");
        }

        transaction.update(userRef, {
          courses: arrayRemove(courseToRemove),
          [`progress.${courseId}`]: deleteField(),
        });
      });

      // Обновляем состояние Redux store
      dispatch(removeCourse(courseId));
      console.log("Course removed successfully");
    } catch (error) {
      console.error("Ошибка удаления курса:", error);

      let errorMessage = "Не удалось удалить курс";
      if (error.code === "unavailable") {
        errorMessage =
          "Изменения будут сохранены при восстановлении соединения";
      } else if (error.code === "permission-denied") {
        errorMessage = "Нет прав для изменения данных";
      } else if (error.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
    } finally {
      setRemovingCourseId(null);
    }
  };

  /**
   * Расчет прогресса прохождения курса
   * @param {string} courseId - ID курса
   * @returns {number} Процент завершения (0-100)
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

      {/* Модальные окна */}
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
      {showWorkoutSelection && selectedCourse && (
        <WorkoutSelectionModal
          course={selectedCourse}
          onClose={handleCloseWorkoutModal}
          onWorkoutSelect={handleWorkoutSelect}
        />
      )}

      {/* Блок с информацией о профиле */}
      <S.ProfileBlock>
        <S.Title>Профиль</S.Title>
        <S.ProfileContainer>
          <S.ProfileAvatarImg
            src="/img/avatar1.svg"
            alt="Аватар пользователя"
          />
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
              // Пропускаем курсы без ID
              if (!course?._id) {
                console.warn("Course without ID found:", course);
                return null;
              }

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
                    disabled={removingCourseId === course._id}
                    aria-label={`Удалить курс ${course.nameRU}`}
                  >
                    {removingCourseId === course._id ? (
                      <S.LoadingSpinner aria-hidden="true" />
                    ) : (
                      <S.AddedIcon
                        src="/img/added-icon.svg"
                        alt=""
                        aria-hidden="true"
                      />
                    )}
                  </S.RemoveButton>

                  {/* Карточка курса */}
                  <S.ImgTraining
                    src={`/img/card-course/card-${course.nameEN}.jpg`}
                    alt={`Обложка курса ${course.nameRU}`}
                  />

                  <S.TrainingContainer>
                    <S.TitleTraining>{course.nameRU}</S.TitleTraining>

                    {/* Информация о курсе */}
                    <S.InfoItems>
                      <S.InfoItem>
                        <S.InfoIcon
                          src="/img/calendar-icon.svg"
                          alt="Длительность"
                          aria-hidden="true"
                        />
                        <S.InfoText>25 дней</S.InfoText>
                      </S.InfoItem>
                      <S.InfoItem>
                        <S.InfoIcon
                          src="/img/clock-icon.svg"
                          alt=""
                          aria-hidden="true"
                        />
                        <S.InfoText>20-50 мин/день</S.InfoText>
                      </S.InfoItem>
                      <S.InfoItem>
                        <S.InfoIcon
                          src="/img/difficulty-icon.svg"
                          alt="Сложность"
                          aria-hidden="true"
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
                      <S.ProgressBar
                        role="progressbar"
                        aria-valuenow={progressPercent}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <S.ProgressBarFill $progress={progressPercent} />
                      </S.ProgressBar>
                    </div>

                    {/* Кнопка перехода к тренировкам */}
                    <S.ProgressButton
                      onClick={() => handleWorkoutButtonClick(course)}
                      aria-label={`${buttonText} в курсе ${course.nameRU}`}
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

      {/* Ссылка на все курсы */}
      <S.viewAllCourses
        as={Link}
        to="/"
        aria-label="Перейти к списку всех курсов"
      >
        Все курсы
      </S.viewAllCourses>
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
  const [error, setError] = useState(null);

  /**
   * Функция сохранения нового логина
   */
  const saveNewLogin = () => {
    if (!newLog.trim()) {
      setError("Логин не может быть пустым");
      return;
    }

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
            onChange={(e) => {
              setNewLog(e.target.value);
              setError(null);
            }}
          />
        </S.Inputs>
        {error && <S.ErrorText>{error}</S.ErrorText>}
        <S.Button onClick={saveNewLogin}>Сохранить</S.Button>
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
  const [loading, setLoading] = useState(false);

  /**
   * Функция проверки старого пароля
   */
  const checkOldPassword = async () => {
    if (!oldPass.trim()) {
      setErrorPassword("Введите пароль");
      return;
    }

    setLoading(true);
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
      console.error("Reauthentication error:", error);
      setErrorPassword("Неверный пароль"); // Показываем ошибку, если пароль неверный
    } finally {
      setLoading(false);
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
            onChange={(e) => {
              setOldPass(e.target.value);
              setErrorPassword(false);
            }}
          />
        </S.Inputs>
        {errorPassword && <S.ErrorText>{errorPassword}</S.ErrorText>}
        <S.Button
          disabled={!oldPass.trim() || loading}
          onClick={checkOldPassword}
        >
          {loading ? "Проверка..." : "Далее"}
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
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  /**
   * Функция сохранения нового пароля
   */
  const saveNewPassword = async () => {
    if (newPass !== repeatNewPass) {
      setError("Пароли не совпадают");
      return;
    }

    if (newPass.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setLoading(true);
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      // Обновляем пароль в Firebase Auth
      await updatePassword(user, newPass);
      dispatch(setNewPassword(newPass)); // Обновляем в Redux
      setOpenEditPassword(false); // Закрываем модальное окно
    } catch (error) {
      console.error("Password update error:", error);
      setError("Ошибка при смене пароля");
    } finally {
      setLoading(false);
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
            placeholder="Пароль (минимум 6 символов)"
            value={newPass}
            onChange={(e) => {
              setNewPass(e.target.value);
              setError(null);
            }}
          />
          <S.Input
            type="password"
            placeholder="Повторите пароль"
            value={repeatNewPass}
            onChange={(e) => {
              setRepeatNewPass(e.target.value);
              setError(null);
            }}
          />
        </S.Inputs>
        {error && <S.ErrorText>{error}</S.ErrorText>}
        <S.Button
          disabled={!newPass.trim() || !repeatNewPass.trim() || loading}
          onClick={saveNewPassword}
        >
          {loading ? "Сохранение..." : "Сохранить"}
        </S.Button>
      </S.PopupPassword>
    </S.BlackoutWrapper>
  );
};
