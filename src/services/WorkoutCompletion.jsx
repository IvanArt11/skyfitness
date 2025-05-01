import React, { useState } from "react";
import { useAuth } from "../hooks/use-auth";
import { useDispatch } from "react-redux";
import { completeWorkout } from "../services/firebaseService";
import * as S from "./style";

export const WorkoutCompletion = ({
  courseId,
  workoutId,
  onComplete,
  isCompleted,
}) => {
  const { id: userId } = useAuth();
  const dispatch = useDispatch();
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState(null);

  const handleComplete = async () => {
    if (!userId || !courseId || !workoutId || isCompleted) return;

    setIsCompleting(true);
    setError(null);

    try {
      await completeWorkout(userId, courseId, workoutId, dispatch);
      onComplete?.();
    } catch (err) {
      console.error("Ошибка завершения:", err);
      setError("Не удалось сохранить прогресс");
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <S.CompletionWrapper>
      <S.CompleteButton
        onClick={handleComplete} // Исправлено: было onComplete
        disabled={isCompleting || isCompleted}
        $completed={isCompleted}
      >
        {isCompleting
          ? "Сохранение..."
          : isCompleted
            ? "Тренировка завершена"
            : "Завершить тренировку"}
      </S.CompleteButton>

      {error && <S.ErrorText>{error}</S.ErrorText>}
      {isCompleted && !error && (
        <S.SuccessText>Прогресс сохранен!</S.SuccessText>
      )}
    </S.CompletionWrapper>
  );
};
