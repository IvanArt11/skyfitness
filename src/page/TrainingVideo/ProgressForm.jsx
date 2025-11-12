import React, { useState } from "react";
import PropTypes from "prop-types";
import * as S from "./styles";

export const ProgressForm = ({
  onClose,
  onSave,
  workoutData,
  currentExercisesProgress,
}) => {
  const [exercisesProgress, setExercisesProgress] = useState(
    workoutData.exercises.reduce((acc, exercise) => {
      acc[exercise._id] = currentExercisesProgress[exercise._id] || 0;
      return acc;
    }, {})
  );

  const handleExerciseProgressChange = (exerciseId, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    const maxValue =
      workoutData.exercises.find((ex) => ex._id === exerciseId)?.quantity || 1;
    const clampedValue = Math.min(numValue, maxValue);

    setExercisesProgress((prev) => ({
      ...prev,
      [exerciseId]: clampedValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(exercisesProgress);
  };

  return (
    <S.ProgressFormBackdrop onClick={onClose}>
      <S.ProgressFormContainer onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={onClose} aria-label="Закрыть форму прогресса">
          &times;
        </S.CloseButton>

        <S.ProgressFormTitle>Мой прогресс</S.ProgressFormTitle>

        <form onSubmit={handleSubmit}>
          <S.ExercisesProgressList>
            {workoutData.exercises.map((exercise, index) => (
              <S.ExerciseProgressItem
                key={`exercise-${exercise._id || index}`} // Используем index как fallback
              >
                <S.ProgressFormLabel>
                  Сколько раз вы сделали "{exercise.name}"?
                  <br />
                  (максимум: {exercise.quantity})
                </S.ProgressFormLabel>
                <S.ProgressInput
                  type="number"
                  min="0"
                  max={exercise.quantity}
                  value={exercisesProgress[exercise._id] || 0}
                  onChange={(e) =>
                    handleExerciseProgressChange(exercise._id, e.target.value)
                  }
                  aria-label={`Количество выполненных ${exercise.name}`}
                />
              </S.ExerciseProgressItem>
            ))}
          </S.ExercisesProgressList>

          <S.ProgressSubmitButton type="submit">
            Сохранить прогресс
          </S.ProgressSubmitButton>
        </form>
      </S.ProgressFormContainer>
    </S.ProgressFormBackdrop>
  );
};

ProgressForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  workoutData: PropTypes.object.isRequired,
  currentExercisesProgress: PropTypes.object.isRequired,
};
