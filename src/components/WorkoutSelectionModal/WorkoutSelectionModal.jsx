import React from "react";
import * as S from "./style";
import { ReactComponent as CloseIcon } from "./close.svg"; // Импорт иконки закрытия
import PropTypes from "prop-types";

/**
 * Компонент модального окна выбора тренировки
 * @param {Object} props - Пропсы компонента
 * @param {Object} props.course - Данные курса с тренировками
 * @param {Function} props.onClose - Функция закрытия модального окна
 * @param {Function} props.onWorkoutSelect - Обработчик выбора тренировки
 */

export const WorkoutSelectionModal = ({ course, onClose, onWorkoutSelect }) => {
  // Добавляем проверку данных
  if (!course || !course._id) {
    console.error("Не передан курс или отсутствует ID курса", course);
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

  // Проверка наличия тренировок
  const hasWorkouts = course?.workouts?.length > 0;

  return (
    <S.BlackoutWrapper onClick={onClose}>
      {/* Останавливаем всплытие события, чтобы модалка не закрывалась при клике на неё */}
      <S.PopupWorkoutSelection onClick={(e) => e.stopPropagation()}>
        {/* Кнопка закрытия модального окна */}
        <S.CloseButton onClick={onClose} aria-label="Закрыть окно выбора">
          <CloseIcon width={24} height={24} />
        </S.CloseButton>

        {/* Заголовок модального окна */}
        <S.WorkoutSelectionTitle>Выберите тренировку</S.WorkoutSelectionTitle>

        {/* Список доступных тренировок */}
        {hasWorkouts ? (
          <S.WorkoutList>
            {course.workouts.map((workout, index) => {
              // Проверяем наличие ID тренировки
              if (!workout._id) {
                console.error("Тренировка без ID:", workout);
                return null;
              }

              return (
                <S.WorkoutItem key={workout._id}>
                  <S.WorkoutButton
                    onClick={() => {
                      console.log("Выбрана тренировка:", {
                        courseId: course._id,
                        workoutId: workout._id,
                        workout,
                      });
                      onWorkoutSelect({
                        ...workout,
                        courseId: course._id,
                      });
                    }}
                  >
                    <S.WorkoutNumber>День {index + 1}</S.WorkoutNumber>
                    <S.WorkoutName>{workout.name}</S.WorkoutName>
                  </S.WorkoutButton>
                </S.WorkoutItem>
              );
            })}
          </S.WorkoutList>
        ) : (
          <S.EmptyMessage>В этом курсе пока нет тренировок</S.EmptyMessage>
        )}
      </S.PopupWorkoutSelection>
    </S.BlackoutWrapper>
  );
};

WorkoutSelectionModal.propTypes = {
  course: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    workouts: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string.isRequired,
      })
    ).isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
  onWorkoutSelect: PropTypes.func.isRequired,
};
