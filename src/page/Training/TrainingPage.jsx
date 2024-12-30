import { Link, useNavigate, useParams } from "react-router-dom";
import * as S from "./styles";
import { TrainingSkillSkeleton } from "../../components/Skeletons/ТrainingSkillSkeleton";
import React, { useEffect, useState } from "react";
import { getWorkout } from "../../api";
import { useAuth } from "../../hooks/use-auth";
import PropTypes from "prop-types";

export const TrainingPage = ({ courses }) => {
  // Состояния компонента
  const [isLoading, setIsLoading] = React.useState(true);
  const [allCourses, setAllCourses] = useState({});
  const [dataCourse, setDataCourse] = useState({});
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const param = useParams();
  const userId = useAuth().id;

  // Находим нужный курс из пропсов
  const scills = courses
    ? Object.values(courses).find((course) => course.id === param.id)
    : null;

  // Получаем данные о тренировках при монтировании компонента
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getWorkout();
        if (data) {
          setAllCourses(data);
          setIsLoading(false);

          // Ищем конкретный курс по ID
          for (let item in data) {
            if (data[item]._id === param.id) {
              setDataCourse(data[item]);
              break;
            }
          }
        }
      } catch (error) {
        console.error("Error fetching workout data:", error);
        setError("Ошибка при загрузке данных");
        setIsLoading(false);
      }
    };

    fetchData();
  }, [param.id]);

  // Вспомогательная функция для создания массива прогресса
  const fillEmptyArray = (num) => {
    return Array(num).fill(0);
  };

  // Обработчик записи на курс
  const handleClickRecord = async () => {
    if (!dataCourse || !courses || !dataCourse._id) {
      setError("Недостаточно данных для записи");
      return;
    }

    try {
      const arrayCourses = [];

      // Собираем все курсы для записи
      if (courses[dataCourse._id]?.workout) {
        courses[dataCourse._id].workout.forEach((item) => {
          if (allCourses && allCourses[item]) {
            arrayCourses.push(allCourses[item]);
          }
        });
      }

      // Формируем данные для обновления
      const patchData = {};
      arrayCourses.forEach((course) => {
        const userToAdd = {
          progress: fillEmptyArray(
            course.exercises ? course.exercises.length : 1
          ),
          userId: userId,
        };
        patchData[`workout/${course.shortId}/users`] = [
          ...(course.users || []),
          userToAdd,
        ];
      });

      // Отправляем запрос на обновление данных
      const response = await fetch(
        "https://fitness-pro-6b7ae-default-rtdb.europe-west1.firebasedatabase.app/.json",
        {
          method: "PATCH",
          body: JSON.stringify(patchData),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при обновлении данных");
      }

      console.log("Данные успешно обновлены");
      navigate("/profile", { replace: true });
    } catch (error) {
      console.error(error);
      setError("Ошибка при записи на курс");
    }
  };

  // Отображение ошибки
  if (error) {
    return <div>Произошла ошибка: {error}</div>;
  }

  // Отображение загрузки
  if (isLoading) {
    return <TrainingSkillSkeleton />;
  }

  return (
    <div>
      <S.ScillCard>
        <S.ScillImg src="/img/Group.jpg" alt="scill" />
        <S.ScillTitle>{scills?.name}</S.ScillTitle>
      </S.ScillCard>

      <S.ScillDescription>
        <S.ScillDescriptionTitle>
          Подойдет для вас, если:
        </S.ScillDescriptionTitle>

        <S.Description>
          <S.DescriptionTextOne>
            <S.Circle>1</S.Circle>
            <S.DescriptionText>{scills?.towards[0]}</S.DescriptionText>
          </S.DescriptionTextOne>

          <S.DescriptionTextOne>
            <S.Circle>2</S.Circle>
            <S.DescriptionText>{scills?.towards[1]}</S.DescriptionText>
          </S.DescriptionTextOne>

          <S.DescriptionTextOne>
            <S.Circle>3</S.Circle>
            <S.DescriptionText>{scills?.towards[2]}</S.DescriptionText>
          </S.DescriptionTextOne>
        </S.Description>
      </S.ScillDescription>

      <S.DirectionConteiner>
        <S.DescriptionText>Направления:</S.DescriptionText>
        <S.YogaDirection>
          <S.Direct>
            {scills?.directions?.map((item, index) => (
              <S.YogaText key={index}>{item}</S.YogaText>
            ))}
          </S.Direct>
        </S.YogaDirection>
      </S.DirectionConteiner>

      <S.DiscriptionYoga>
        <S.TextDiscriptionYoga>{scills?.description}</S.TextDiscriptionYoga>
      </S.DiscriptionYoga>

      {dataCourse?.users &&
      !dataCourse.users.find((obj) => obj.userId === userId) ? (
        <S.RecordBox>
          <S.RecordText>
            Оставьте заявку на пробное занятие, мы свяжемся с вами, поможем с
            выбором направления и тренера, с которым тренировки принесут
            здоровье и радость!
          </S.RecordText>

          <S.btnRecord onClick={handleClickRecord}>
            Записаться на тренировку
          </S.btnRecord>

          <S.PhoneImg src="/img/phone.svg" alt="phone" />
        </S.RecordBox>
      ) : (
        <Link to={"/profile"}>
          <S.goToProfile>перейти в профиль</S.goToProfile>
        </Link>
      )}
    </div>
  );
};

// Проверка типов пропсов
TrainingPage.propTypes = {
  courses: PropTypes.object,
};

// Дефолтные значения пропсов
TrainingPage.defaultProps = {
  courses: {},
};
