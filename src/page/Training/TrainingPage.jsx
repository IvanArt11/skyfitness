import { Link, useNavigate, useParams } from "react-router-dom";
import * as S from "./styles";
import { TrainingSkillSkeleton } from "../../components/Skeletons/ТrainingSkillSkeleton";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../../hooks/use-auth";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { addCourse } from "../../store/slices/userSlice"; // Импортируем action для добавления курса

/**
 * Страница курса.
 * @param {Object} courses - Данные курсов
 */
export const TrainingPage = ({ courses = {} }) => {
  const [dataCourse, setDataCourse] = useState({}); // Данные текущего курса
  const [error, setError] = useState(null); // Состояние ошибки

  const navigate = useNavigate();
  const param = useParams();
  const { isAuth, id: userId } = useAuth(); // Получаем состояние авторизации и ID пользователя
  const dispatch = useDispatch();
  const userCourses = useSelector((state) => state.user.courses); // Получаем список курсов пользователя из Redux

  // Поиск текущего курса по ID
  const scills = useMemo(() => {
    return Object.values(courses).find((course) => course._id === param._id);
  }, [courses, param._id]);

  // Загрузка данных курса
  useEffect(() => {
    if (scills) {
      setDataCourse(scills);
    } else {
      setError("Курс не найден");
    }
  }, [scills]);

  // Проверка, добавлен ли курс пользователем
  const isCourseAdded = useMemo(() => {
    return userCourses?.some((course) => course._id === scills?._id);
  }, [userCourses, scills]);

  // Обработчик добавления курса
  const handleAddCourse = useCallback(async () => {
    try {
      if (!isAuth) {
        navigate("/login"); // Если пользователь не авторизован, перенаправляем на /login
        return;
      }

      if (!scills) {
        throw new Error("Курс не найден");
      }

      // Добавляем курс в Redux
      dispatch(addCourse(scills));
      navigate("/profile"); // Перенаправляем на страницу профиля
    } catch (error) {
      setError(error.message);
    }
  }, [isAuth, scills, dispatch, navigate]);

  // Отображение ошибки
  if (error) {
    return <div>Произошла ошибка: {error}</div>;
  }

  // Отображение скелетона при загрузке
  if (!scills) {
    return <TrainingSkillSkeleton />;
  }

  return (
    <div>
      <S.ScillCard>
        <S.ScillImg
          src={`/img/training/skill card-${scills.nameEN}.jpg`}
          alt="scill"
        />
      </S.ScillCard>

      <S.ScillDescription>
        <S.ScillDescriptionTitle>
          Подойдет для вас, если:
        </S.ScillDescriptionTitle>

        <S.Description>
          {scills?.fitting?.map((item, index) => (
            <S.DescriptionTextOne key={index}>
              <S.Circle>{index + 1}</S.Circle>
              <S.DescriptionText>{item}</S.DescriptionText>
            </S.DescriptionTextOne>
          ))}
        </S.Description>
      </S.ScillDescription>

      <S.DirectionConteiner>
        <S.ScillDescriptionTitle>Направления:</S.ScillDescriptionTitle>
        <S.YogaDirection>
          <S.Direct>
            {scills?.directions?.map((item, index) => (
              <S.YogaText key={index}>{item}</S.YogaText>
            ))}
          </S.Direct>
        </S.YogaDirection>
      </S.DirectionConteiner>

      <S.DiscriptionConteiner>
        <S.DiscriptionYoga>
          <S.DiscriptionTitle>Начните путь к новому телу</S.DiscriptionTitle>
          <S.TextDiscriptionYoga>{scills?.description}</S.TextDiscriptionYoga>

          {isCourseAdded ? ( // Если курс уже добавлен
            <Link to={"/profile"}>
              <S.goToProfile>Перейти в профиль</S.goToProfile>
            </Link>
          ) : isAuth ? ( // Если пользователь авторизован
            <S.btnRecord onClick={handleAddCourse}>Добавить курс</S.btnRecord>
          ) : (
            // Если пользователь не авторизован
            <Link to={"/login"}>
              <S.btnRecord>Войдите, чтобы добавить курс</S.btnRecord>
            </Link>
          )}
        </S.DiscriptionYoga>
        <S.DiscriptionImg src={`/img/training/Mask group.svg`} alt="scill" />
      </S.DiscriptionConteiner>

      {/* {isCourseAdded ? ( // Если курс уже добавлен
        <Link to={"/profile"}>
          <S.goToProfile>Перейти в профиль</S.goToProfile>
        </Link>
      ) : isAuth ? ( // Если пользователь авторизован
        <S.btnRecord onClick={handleAddCourse}>Добавить курс</S.btnRecord>
      ) : (
        // Если пользователь не авторизован
        <Link to={"/login"}>
          <S.btnRecord>Войдите, чтобы добавить курс</S.btnRecord>
        </Link>
      )} */}
    </div>
  );
};

// Проверка типов пропсов
TrainingPage.propTypes = {
  courses: PropTypes.object.isRequired,
};

export default TrainingPage;
