import { Link, useNavigate, useParams } from "react-router-dom";
import * as S from "./styles";
import { TrainingSkillSkeleton } from "../../components/Skeletons/ТrainingSkillSkeleton";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../../hooks/use-auth";
import PropTypes from "prop-types";

/**
 * Страница курса.
 * @param {Object} courses - Данные курсов
 */
export const TrainingPage = ({ courses = {} }) => {
  const [dataCourse, setDataCourse] = useState({}); // Данные текущего курса
  const [error, setError] = useState(null); // Состояние ошибки

  const navigate = useNavigate();
  const param = useParams();
  const { id: userId } = useAuth(); // Получаем ID пользователя из контекста

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

  // Обработчик записи на курс
  const handleClickRecord = useCallback(async () => {
    try {
      if (!userId || !dataCourse?._id || !courses) {
        throw new Error("Недостаточно данных для записи");
      }

      // Логика записи на курс...
      navigate("/profile", { replace: true });
    } catch (error) {
      setError(error.message);
    }
  }, [userId, dataCourse, courses, navigate]);

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
        <S.ScillImg src={`/img/training/skill card-${scills.nameEN}.jpg`} alt="scill" />
        {/* <S.ScillTitle>{scills?.nameRU}</S.ScillTitle> */}
      </S.ScillCard>

      <S.ScillDescription>
        <S.ScillDescriptionTitle>
          Подойдет для вас, если:
        </S.ScillDescriptionTitle>

        <S.Description>
        
          {scills?.towards?.map((item, index) => (
            <S.DescriptionTextOne key={index}>
              <S.Circle>{index + 1}</S.Circle>
              <S.DescriptionText>{item}</S.DescriptionText>
            </S.DescriptionTextOne>
          ))}
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
  courses: PropTypes.object.isRequired,
};

export default TrainingPage;
