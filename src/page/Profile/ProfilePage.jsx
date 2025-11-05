/**
 * Компонент страницы профиля пользователя
 * Отображает информацию о пользователе, его курсы и прогресс по ним
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
} from "firebase/firestore"; // Инициализированный экземпляр Firestore
import { db } from "../../firebase";
import { enableIndexedDbPersistence } from "firebase/firestore"; // Инициализированный экземпляр Firestore
import { WorkoutSelectionModal } from "../../components/WorkoutSelectionModal/WorkoutSelectionModal";
import { removeCourseFromUser } from "../../api";

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

  // Состояния для управления модальными окнами UI
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

  console.log("Profile data:", { courses, progress }); // Для отладки

  /**
   * Обработчик открытия модального окна выбора тренировки
   * @param {Object} course - Объект курса
   */
  const handleWorkoutButtonClick = (course) => {
    if (!course?._id || !Array.isArray(course.workouts)) {
      console.error("Неверный объект курса:", course);
      setError("Неверный объект курса");
      return;
    }

    // Получаем полные данные тренировок из хранилища или пропсов
    const fullWorkouts = course.workouts.map((workoutId) => ({
      _id: workoutId,
      name: `Тренировка ${workoutId}`,
    }));

    setSelectedCourse({
      ...course,
      workouts: fullWorkouts,
    });
    setShowWorkoutSelection(true);
  };

  // Эффект для загрузки данных пользователя
  useEffect(() => {
    if (!userId) {
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

        // Подписываемся на изменения документа пользователя
        unsubscribe = onSnapshot(
          userRef,
          // Обработчик успешного получения данных
          (doc) => {
            if (doc.exists()) {
              const userData = doc.data();
              console.log("User data from Firestore:", userData); // Для отладки
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
      } catch (error) {
        console.error("Error creating user document:", error);
        handleFirestoreError(error);
      }
    };

    const handleFirestoreError = (error) => {
      console.error("Firestore error:", error);

      // Обработка оффлайн-режима
      if (error.code === "unavailable") {
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

    fetchUserData();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId, dispatch]);

  /**
   * Проверяет, является ли тренировка полностью выполненной
   * Тренировка считается выполненной, если прогресс = 100%
   * @param {Object} workoutData - Данные тренировки
   * @returns {boolean} true если тренировка выполнена полностью
   */
  const isWorkoutCompleted = (workoutData) => {
    if (!workoutData) return false;

    // Проверяем общий прогресс тренировки
    return workoutData.progress === 100;
  };

  /**
   * Расчет прогресса прохождения курса
   * Прогресс = (Количество выполненных тренировок / Общее количество тренировок) * 100%
   * @param {string} courseId - ID курса
   * @returns {number} Процент завершения (0-100)
   */
  const getCourseProgress = (courseId) => {
    const courseProgress = progress[courseId];
    console.log(`Progress for course ${courseId}:`, courseProgress); // Для отладки

    if (!courseProgress) return 0;

    const course = courses.find((c) => c._id === courseId);
    if (!course?.workouts?.length) return 0;

    const totalWorkouts = course.workouts.length;
    let completedWorkouts = 0;

    // Считаем количество выполненных тренировок
    course.workouts.forEach((workoutId) => {
      const workoutData = courseProgress.workouts?.[workoutId];
      console.log(`Workout ${workoutId} data:`, workoutData); // Для отладки

      if (isWorkoutCompleted(workoutData)) {
        completedWorkouts++;
      }
    });

    const progressPercent = Math.round(
      (completedWorkouts / totalWorkouts) * 100
    );
    console.log(
      `Course ${courseId} progress: ${completedWorkouts}/${totalWorkouts} = ${progressPercent}%`
    ); // Для отладки

    return progressPercent;
  };

  /**
   * Получает количество выполненных тренировок в курсе
   * @param {string} courseId - ID курса
   * @returns {Object} {completed: number, total: number}
   */
  const getWorkoutsCompletion = (courseId) => {
    const courseProgress = progress[courseId];
    if (!courseProgress) return { completed: 0, total: 0 };

    const course = courses.find((c) => c._id === courseId);
    if (!course?.workouts?.length) return { completed: 0, total: 0 };

    const totalWorkouts = course.workouts.length;
    let completedWorkouts = 0;

    course.workouts.forEach((workoutId) => {
      const workoutData = courseProgress.workouts?.[workoutId];
      if (isWorkoutCompleted(workoutData)) {
        completedWorkouts++;
      }
    });

    return { completed: completedWorkouts, total: totalWorkouts };
  };

  /**
   * Удаление курса из профиля пользователя
   * @param {string} courseId - ID курса для удаления
   */
  const handleRemoveCourse = async (courseId) => {
    if (!userId || !courseId) return;

    const courseToRemove = courses.find((c) => c._id === courseId);
    if (!courseToRemove) return;

    const confirmRemove = window.confirm(
      `Удалить курс "${courseToRemove.nameRU}"?`
    );
    if (!confirmRemove) return;

    try {
      setRemovingCourseId(courseId); // Устанавливаем курс, который удаляем
      setError(null);

      // Используем новую API функцию для удаления курса
      await removeCourseFromUser(userId, courseId);

      // Обновляем состояние Redux store
      dispatch(removeCourse(courseId));
    } catch (error) {
      console.error("Ошибка удаления курса:", error);
      setError("Не удалось удалить курс");
    } finally {
      setRemovingCourseId(null);
    }
  };

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
          onClose={() => setShowWorkoutSelection(false)}
          onWorkoutSelect={(workout) =>
            navigate(`/training-video/${selectedCourse._id}/${workout._id}`)
          }
        />
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
                Изменить пароль
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
              if (!course?._id) return null;

              // Рассчитываем прогресс по курсу
              const progressPercent = getCourseProgress(course._id);
              const workoutsStats = getWorkoutsCompletion(course._id);
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
                    disabled={removingCourseId === course._id}
                    title="Удалить курс"
                  >
                    {removingCourseId === course._id ? (
                      <S.LoadingSpinner />
                    ) : (
                      <S.AddedIcon src="/img/added-icon.svg" alt="" />
                    )}
                  </S.RemoveButton>

                  {/* Карточка курса */}
                  <S.ImgTraining
                    src={`/img/card-course/card-${course.nameEN}.jpg`}
                    alt={`Курс ${course.nameRU}`}
                  />

                  <S.TrainingContainer>
                    <S.TitleTraining>{course.nameRU}</S.TitleTraining>

                    {/* Информация о курсе */}
                    <S.InfoItems>
                      <S.InfoItem>
                        <S.InfoIcon src="/img/calendar-icon.svg" alt="" />
                        <S.InfoText>25 дней</S.InfoText>
                      </S.InfoItem>
                      <S.InfoItem>
                        <S.InfoIcon src="/img/clock-icon.svg" alt="" />
                        <S.InfoText>20-50 мин/день</S.InfoText>
                      </S.InfoItem>
                      <S.InfoItem>
                        <S.InfoIcon src="/img/difficulty-icon.svg" alt="" />
                        <S.InfoText>Сложность</S.InfoText>
                      </S.InfoItem>
                    </S.InfoItems>

                    {/* Прогресс-бар */}
                    <div>
                      <S.ProgressHeader>
                        <span>
                          Тренировки:
                          {/* {workoutsStats.completed}/{workoutsStats.total} */}
                        </span>
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
      <S.viewAllCourses as={Link} to="/">
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
          <S.Input
            type="password"
            placeholder="Новый пароль"
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
