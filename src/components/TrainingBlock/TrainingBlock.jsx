import { Link, useNavigate } from "react-router-dom";
import * as S from "./style";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCourse, removeCourse } from "../../store/slices/userSlice"; // Импортируем actions для управления курсами
import { useAuth } from "../../hooks/use-auth"; // Импортируем useAuth для проверки авторизации

export const TrainingBlock = ({ courses }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Хук для перенаправления
  const { isAuth } = useAuth(); // Проверка авторизации
  const userCourses = useSelector((state) => state.user.courses); // Получаем список курсов пользователя из Redux
  const [addedCourses, setAddedCourses] = useState(
    new Set(userCourses?.map((course) => course._id) || new Set()) // Состояние для отслеживания добавленных курсов // Проверка на undefined
  );

  // Функция для добавления или удаления курса
  const handleAddCourse = (course) => {
    if (!isAuth) {
      // Если пользователь не авторизован, перенаправляем на /login
      navigate("/login");
      return;
    }

    if (!course || !course._id) return; // Проверка на undefined

    if (addedCourses.has(course._id)) {
      // Если курс уже добавлен, удаляем его
      dispatch(removeCourse(course._id));
      setAddedCourses((prev) => {
        const newSet = new Set(prev);
        newSet.delete(course._id);
        return newSet;
      });
    } else {
      // Если курс не добавлен, добавляем его
      dispatch(addCourse(course));
      setAddedCourses((prev) => new Set(prev).add(course._id));
    }
  };

  if (!courses || !Object.values(courses).length) {
    return <div>Нет доступных курсов</div>; // Если курсы не загружены
  }

  return Object.values(courses).map((course) => {
    if (!course || !course._id) return null; // Пропускаем некорректные курсы

    return (
      <S.SectionTraining key={course._id}>
        {/* Кнопка для добавления/удаления курса */}
        <S.AddButton
          onClick={() => handleAddCourse(course)}
          $isAdded={addedCourses.has(course._id)}
        >
          {addedCourses.has(course._id) ? (
            <S.AddedIcon src="/img/added-icon.svg" alt="Added" />
          ) : (
            <S.PlusIcon src="/img/plus-icon.svg" alt="Add" />
          )}
        </S.AddButton>

        {/* Ссылка на страницу курса */}
        <Link to={`/courses/${course._id}`}>
          <S.ImgTraining src={`/img/card-course/card-${course.nameEN}.jpg`} />
          <S.TrainingContainer>
            <S.TitleTraining>{course.nameRU}</S.TitleTraining>
            <S.InfoContainer>
              <S.InfoItem>
                <S.InfoIcon src="/img/calendar-icon.svg" alt="Calendar" />
                 {/* <S.InfoText>{course.duration} дней</S.InfoText> */}
                <S.InfoText>25 дней</S.InfoText>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoIcon src="/img/clock-icon.svg" alt="Clock" />
                {/* <S.InfoText>{course.timePerDay} мин/день</S.InfoText> */}
                <S.InfoText>20-50 мин/день</S.InfoText>
              </S.InfoItem>
              <S.InfoItem>
                <S.InfoIcon src="/img/difficulty-icon.svg" alt="Difficulty" />
                {/* <S.InfoText>{course.difficulty}</S.InfoText> */}
                <S.InfoText>Сложность</S.InfoText>
              </S.InfoItem>
            </S.InfoContainer>
          </S.TrainingContainer>
        </Link>
      </S.SectionTraining>
    );
  });
};
