import React from "react";
import * as S from "./style";
import { ReactComponent as CloseIcon } from "./close.svg"; // Импорт иконки закрытия
import PropTypes from "prop-types";

/**
 * Модальное окно выбора тренировки
 * @param {Object} props - Пропсы компонента
 * @param {Object} props.course - Данные курса с тренировками
 * @param {Function} props.onClose - Функция закрытия модального окна
 * @param {Function} props.onWorkoutSelect - Обработчик выбора тренировки
 */
export const WorkoutSelectionModal = ({ course, onClose, onWorkoutSelect }) => {
  // Проверка валидности данных курса
  if (!course || !course._id || !Array.isArray(course.workouts)) {
    console.error("Некорректные данные курса:", course);
    return (
      <S.BlackoutWrapper onClick={onClose}>
        <S.PopupWorkoutSelection onClick={(e) => e.stopPropagation()}>
          <S.CloseButton onClick={onClose}>
            <CloseIcon width={24} height={24} />
          </S.CloseButton>
          <S.ErrorMessage>Ошибка: некорректные данные курса</S.ErrorMessage>
        </S.PopupWorkoutSelection>
      </S.BlackoutWrapper>
    );
  }

  // Преобразование тренировок в единый формат
  const normalizedWorkouts = course.workouts.map((workout) => {
    return typeof workout === "string"
      ? { _id: workout, name: `Тренировка ${workout}` }
      : workout;
  });

  // Фильтрация валидных тренировок
  const validWorkouts = normalizedWorkouts.filter(
    (workout) => workout && workout._id
  );

  return (
    <S.BlackoutWrapper onClick={onClose}>
      {/* Останавливаем всплытие события, чтобы модалка не закрывалась при клике внутри */}
      <S.PopupWorkoutSelection onClick={(e) => e.stopPropagation()}>
        {/* Кнопка закрытия модального окна */}
        <S.CloseButton onClick={onClose} aria-label="Закрыть окно выбора">
          <CloseIcon width={24} height={24} />
        </S.CloseButton>

        {/* Заголовок модального окна */}
        <S.WorkoutSelectionTitle>Выберите тренировку</S.WorkoutSelectionTitle>

        {/* Список доступных тренировок */}
        {validWorkouts.length > 0 ? (
          <S.WorkoutList>
            {validWorkouts.map((workout, index) => (
              <S.WorkoutItem key={workout._id}>
                <S.WorkoutButton
                  onClick={() =>
                    onWorkoutSelect({
                      ...workout,
                      courseId: course._id,
                    })
                  }
                >
                  <S.WorkoutNumber>День {index + 1}</S.WorkoutNumber>
                  <S.WorkoutName>{workout.name}</S.WorkoutName>
                </S.WorkoutButton>
              </S.WorkoutItem>
            ))}
          </S.WorkoutList>
        ) : (
          <S.EmptyMessage>В этом курсе нет доступных тренировок</S.EmptyMessage>
        )}
      </S.PopupWorkoutSelection>
    </S.BlackoutWrapper>
  );
};

// Валидация типов пропсов
WorkoutSelectionModal.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    workouts: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onWorkoutSelect: PropTypes.func.isRequired,
};
