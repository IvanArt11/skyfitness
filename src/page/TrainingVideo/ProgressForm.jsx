import { useState } from "react";
import PropTypes from "prop-types";
import * as S from "./styles";

export const ProgressForm = ({
  onClose,
  workoutData,
  userId,
  progressColors,
  currentProgress,
}) => {
  const [progress, setProgress] = useState(currentProgress);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Логика сохранения прогресса
    onClose();
  };

  return (
    <S.ProgressFormBackdrop onClick={onClose}>
      <S.ProgressFormContainer onClick={(e) => e.stopPropagation()}>
        <S.CloseButton onClick={onClose} aria-label="Закрыть форму прогресса">
          &times;
        </S.CloseButton>

        <S.ProgressFormTitle>Ваш прогресс</S.ProgressFormTitle>

        <form onSubmit={handleSubmit}>
          <S.ProgressInput
            type="number"
            min="0"
            max="100"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            aria-label="Процент выполнения тренировки"
          />
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
  workoutData: PropTypes.object.isRequired,
  userId: PropTypes.string.isRequired,
  progressColors: PropTypes.array.isRequired,
  currentProgress: PropTypes.number.isRequired,
};
