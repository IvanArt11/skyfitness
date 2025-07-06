import { Link, useNavigate } from "react-router-dom";
import * as S from "./style";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCourse, removeCourse } from "../../store/slices/userSlice";
import { useAuth } from "../../hooks/use-auth";
import {
  doc,
  getDoc,
  deleteField,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../../firebase";

export const TrainingBlock = ({ courses }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth, id: userId } = useAuth(); // Получаем isAuth и userId из хука useAuth
  const userCourses = useSelector((state) => state.user.courses);

  // Создаем Set из ID курсов пользователя для быстрой проверки
  const addedCourses = new Set(userCourses?.map((course) => course._id) || []);

  /**
   * Добавляет или удаляет курс из коллекции пользователя в Firestore
   * @param {Object} course - Объект курса
   */
  const handleAddCourse = async (course) => {
    if (!isAuth) {
      navigate("/login");
      return;
    }

    if (!course || !course._id) {
      console.error("Invalid course object:", course);
      return;
    }

    try {
      if (addedCourses.has(course._id)) {
        // Если курс уже добавлен - удаляем его
        await removeCourseFromFirestore(userId, course._id);
        dispatch(removeCourse(course._id));
      } else {
        // Если курс не добавлен - добавляем его
        await addCourseToFirestore(userId, course);
        dispatch(addCourse(course));
      }
    } catch (error) {
      console.error("Error updating course:", error);
      // Здесь можно добавить отображение ошибки пользователю
    }
  };

  /**
   * Добавляет курс в Firestore
   * @param {string} userId - ID пользователя
   * @param {Object} course - Объект курса
   */
  const addCourseToFirestore = async (userId, course) => {
    if (!userId) throw new Error("User ID is required");

    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      courses: arrayUnion(course),
      [`progress.${course._id}`]: {
        // Инициализируем прогресс для нового курса
        completedWorkouts: [],
        totalProgress: 0,
      },
    });
  };

  /**
   * Удаляет курс из Firestore
   * @param {string} userId - ID пользователя
   * @param {string} courseId - ID курса
   */
  const removeCourseFromFirestore = async (userId, courseId) => {
    if (!userId || !courseId)
      throw new Error("User ID and Course ID are required");

    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      throw new Error("User document not found");
    }

    // Находим курс для удаления (Firestore требует точного совпадения объекта)
    const courseToRemove = userDoc
      .data()
      .courses.find((c) => c._id === courseId);

    if (courseToRemove) {
      await updateDoc(userRef, {
        courses: arrayRemove(courseToRemove),
        [`progress.${courseId}`]: deleteField(), // Удаляем прогресс по курсу
      });
    }
  };

  // Если курсы не загружены или пусты
  if (!courses || !Object.values(courses).length) {
    return <div>Нет доступных курсов</div>;
  }

  // Рендерим список курсов
  return Object.values(courses).map((course) => {
    if (!course || !course._id) return null; // Пропускаем некорректные курсы

    const isCourseAdded = addedCourses.has(course._id);

    return (
      <S.SectionTraining key={course._id}>
        {/* Кнопка добавления/удаления курса */}
        <S.AddButton
          onClick={() => handleAddCourse(course)}
          $isAdded={isCourseAdded}
          aria-label={isCourseAdded ? "Удалить курс" : "Добавить курс"}
        >
          {isCourseAdded ? (
            <S.AddedIcon src="/img/added-icon.svg" alt="Курс добавлен" />
          ) : (
            <S.PlusIcon src="/img/plus-icon.svg" alt="Добавить курс" />
          )}
        </S.AddButton>

        {/* Ссылка на страницу курса */}
        <Link
          to={`/courses/${course._id}`}
          aria-label={`Подробнее о курсе ${course.nameRU}`}
        >
          <S.ImgTraining
            src={`/img/card-course/card-${course.nameEN}.jpg`}
            alt={`Обложка курса ${course.nameRU}`}
          />
          <S.TrainingContainer>
            <S.TitleTraining>{course.nameRU}</S.TitleTraining>
            <S.InfoContainer>
              <S.InfoItem>
                <S.InfoIcon src="/img/calendar-icon.svg" alt="Длительность" />
                <S.InfoText>25 дней</S.InfoText>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoIcon src="/img/clock-icon.svg" alt="Время занятия" />
                <S.InfoText>20-50 мин/день</S.InfoText>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoIcon src="/img/difficulty-icon.svg" alt="Сложность" />
                <S.InfoText>Средняя</S.InfoText>
              </S.InfoItem>
            </S.InfoContainer>
          </S.TrainingContainer>
        </Link>
      </S.SectionTraining>
    );
  });
};
