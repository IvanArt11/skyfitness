import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import { doc, getDoc, updateDoc, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase";

export const ProfilePage = () => {
  // Состояния для управления модальными окнами
  const [openEditLogin, setOpenEditLogin] = useState(false);
  const [openFormOldPassword, setOpenFormOldPassword] = useState(false);
  const [openEditPassword, setOpenEditPassword] = useState(false);

  // Состояние загрузки данных
  const [loading, setLoading] = useState(true);

  // Состояние для отслеживания оффлайн-режима
  const [offlineMode, setOfflineMode] = useState(false);

  // Состояние для хранения ошибок
  const [error, setError] = useState(null);

  // Получаем данные аутентифицированного пользователя
  const { email, login, password, id: userId } = useAuth();

  // Получаем функцию dispatch для работы с Redux store
  const dispatch = useDispatch();

  // Получаем курсы и прогресс пользователя из Redux store
  const { courses, progress } = useSelector((state) => state.user);

  // Эффект для загрузки данных пользователя
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);

        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          throw new Error("Данные пользователя не найдены");
        }

        const userData = userSnap.data();

        // Проверяем наличие обязательных полей
        if (!userData.courses || !userData.progress) {
          console.warn("Отсутствуют некоторые данные пользователя");
        }

        dispatch(
          setUserCourses({
            courses: userData.courses || [],
            progress: userData.progress || {},
          })
        );
        // setOfflineMode(false);
      } catch (error) {
        console.error("Firestore error:", error);

        if (error.code === "permission-denied") {
          setError("Нет доступа к данным. Войдите снова.");
        } else if (error.code === "unavailable") {
          setOfflineMode(true);
          setError("Оффлайн-режим. Данные могут быть неактуальными.");
        } else {
          setError("Ошибка загрузки данных");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Обработчики изменения состояния сети
    const handleNetworkChange = () => {
      if (navigator.onLine) {
        fetchUserData();
      } else {
        setOfflineMode(true);
      }
    };

    window.addEventListener("online", handleNetworkChange);
    window.addEventListener("offline", handleNetworkChange);

    return () => {
      window.removeEventListener("online", handleNetworkChange);
      window.removeEventListener("offline", handleNetworkChange);
    };
  }, [userId, dispatch]);

  // Функция для удаления курса
  const handleRemoveCourse = async (courseId) => {
    if (!userId) return;

    try {
      const userRef = doc(db, "users", userId);
      const courseToRemove = courses.find((c) => c._id === courseId);

      if (!courseToRemove) {
        throw new Error("Курс не найден");
      }

      await updateDoc(userRef, {
        courses: arrayRemove(courseToRemove),
        [`progress.${courseId}`]: null,
      });

      dispatch(removeCourse(courseId));
    } catch (error) {
      console.error("Ошибка удаления курса:", error);
      setError(
        error.code === "unavailable"
          ? "Изменения будут сохранены при восстановлении соединения"
          : "Не удалось удалить курс"
      );
    }
  };

  // Функция для получения прогресса по курсу
  const getCourseProgress = (courseId) => {
    if (!progress[courseId]) return 0;

    const completed = progress[courseId].completedWorkouts?.length || 0;
    const total =
      courses.find((c) => c._id === courseId)?.workouts?.length || 1;

    return Math.round((completed / total) * 100);
  };

  // Если данные загружаются
  if (loading) {
    return <S.Loading>Загрузка данных...</S.Loading>;
  }

  // Если произошла ошибка
  if (error && !offlineMode) {
    return <S.ErrorMessage>{error}</S.ErrorMessage>;
  }

  return (
    <>
      {/* Баннер оффлайн-режима */}
      {offlineMode && (
        <S.OfflineWarning>
          ⚠️ Вы в оффлайн-режиме. Некоторые данные могут быть неактуальными.
        </S.OfflineWarning>
      )}

      {/* Модальные окна для редактирования логина и пароля */}
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

      {/* Блок профиля */}
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

      {/* Блок курсов */}
      <S.CourseBlock>
        <S.Title>Мои курсы</S.Title>
        {courses?.length > 0 ? ( // Проверяем, есть ли курсы
          <S.CourseItems>
            {courses.map((course) => {
              if (!course?._id) return null; // Пропускаем некорректные курсы

              const progressPercent = getCourseProgress(course._id);
              const buttonText =
                progressPercent === 0
                  ? "Начать тренировки"
                  : progressPercent === 100
                    ? "Пройти заново"
                    : "Продолжить";

              return (
                <S.SectionTraining key={course._id}>
                  {/* Кнопка для удаления курса */}
                  <S.RemoveButton
                    onClick={() => handleRemoveCourse(course._id)}
                    $isAdded={true} // Устанавливаем, что курс уже добавлен
                    title="Удалить курс"
                  >
                    <S.AddedIcon src="/img/added-icon.svg" alt="Удалить" />
                  </S.RemoveButton>

                  <S.ImgTraining
                    src={`/img/card-course/card-${course.nameEN}.jpg`}
                    alt={course.nameRU}
                  />
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

                    <S.ProgressBar>
                      <S.ProgressBarFill $progress={progressPercent} />
                    </S.ProgressBar>

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
          // Если курсов нет, отображаем сообщение
          <S.NoCoursesMessage>
            Вы еще не записывались на курсы
          </S.NoCoursesMessage>
        )}
      </S.CourseBlock>

      {/* Ссылка на все курсы */}
      <Link to={"/"}>
        <S.viewAllCourses>Все курсы</S.viewAllCourses>
      </Link>
    </>
  );
};

// Компонент формы изменения логина
const NewLoginForm = ({ setOpenEditLogin }) => {
  const dispatch = useDispatch();
  const { email, login } = useAuth();
  const [newLog, setNewLog] = useState(login || email);

  const saveNewLogin = () => {
    dispatch(setNewLogin(newLog));
    localStorage.setItem("login", JSON.stringify(newLog));
    setOpenEditLogin(false);
  };

  const closeWindow = () => {
    document.body.style.overflow = null;
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

// Компонент формы старого пароля
const OldPasswordForm = ({ setOpenFormOldPassword, setOpenEditPassword }) => {
  const [oldPass, setOldPass] = useState("");
  const [errorPassword, setErrorPassword] = useState(false);

  const checkOldPassword = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const credential = EmailAuthProvider.credential(user.email, oldPass);

    try {
      await reauthenticateWithCredential(user, credential);
      setOpenFormOldPassword(false);
      setOpenEditPassword(true);
    } catch (error) {
      setErrorPassword(true);
    }
  };

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

// Компонент формы нового пароля
const NewPasswordForm = ({ setOpenEditPassword }) => {
  const dispatch = useDispatch();
  const [newPass, setNewPass] = useState("");
  const [repeatNewPass, setRepeatNewPass] = useState("");

  const saveNewPassword = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    try {
      await updatePassword(user, newPass);
      dispatch(setNewPassword(newPass));
      setOpenEditPassword(false);
    } catch (error) {
      console.error("Ошибка при смене пароля:", error);
    }
  };

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
