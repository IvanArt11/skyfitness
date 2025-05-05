import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import * as S from "./styles";
import { getWorkout } from "../../api";
import { useAuth } from "../../hooks/use-auth";
import ErrorBoundary from "../../components/ErrorBoundary";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner"; // Добавляем компонент загрузки
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage"; // Добавляем компонент ошибки
import { ProgressForm } from "./ProgressForm";

// Константы выносим в отдельный объект
const PROGRESS_BAR_COLORS = [
  "86, 94, 239",
  "255, 109, 0",
  "154, 72, 241",
  "101, 197, 5",
  "210, 16, 225",
];

// Выносим вспомогательные функции в отдельный файл утилит
const getYoutubeEmbedUrl = (youtubeUrl) => {
  if (!youtubeUrl) {
    console.error("URL видео отсутствует");
    return "";
  }

  try {
    const url = new URL(youtubeUrl);
    const videoId = url.searchParams.get("v");
    return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
  } catch (error) {
    console.error("Ошибка при обработке URL видео:", error);
    return "";
  }
};

export const TrainingVideoPage = () => {
  const [isProgressFormOpen, setIsProgressFormOpen] = useState(false);
  const [workoutData, setWorkoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);

  const { id: userId } = useAuth();
  const { _id: courseId } = useParams();

  const fetchWorkoutData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getWorkout();

      if (!data?.courses || !data?.workouts) {
        throw new Error("Неверный формат данных тренировки");
      }

      const course = data.courses[courseId];
      if (!course) {
        throw new Error(`Курс с ID ${courseId} не найден`);
      }

      const workouts = course.workouts
        .map((workoutId) => data.workouts[workoutId])
        .filter(Boolean);

      if (workouts.length === 0) {
        throw new Error("Тренировки не найдены");
      }

      setWorkoutData(workouts[0]);
    } catch (err) {
      console.error("Ошибка загрузки данных:", err);
      setError({
        message: err.message,
        type: err.name === "TypeError" ? "network" : "application",
      });
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchWorkoutData();
  }, [fetchWorkoutData]);

  useEffect(() => {
    if (workoutData?.users) {
      const userProgress =
        workoutData.users.find((user) => user.userId === userId)?.progress || 0;
      setProgressPercent(userProgress);
    }
  }, [workoutData, userId]);

  const handleOpenProgressForm = () => {
    document.body.style.overflow = "hidden";
    setIsProgressFormOpen(true);
  };

  const handleCloseProgressForm = () => {
    document.body.style.overflow = "auto";
    setIsProgressFormOpen(false);
    // Можно добавить обновление данных после закрытия формы
    fetchWorkoutData();
  };

  if (loading) {
    return <LoadingSpinner aria-label="Загрузка данных тренировки" />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error.message}
        errorType={error.type}
        onRetry={fetchWorkoutData}
      />
    );
  }

  if (!workoutData) {
    return <ErrorMessage message="Данные тренировки не найдены" />;
  }

  const { name, video, exercises } = workoutData;
  const embedUrl = getYoutubeEmbedUrl(video);

  return (
    <ErrorBoundary>
      <S.VideoPage>
        {isProgressFormOpen && (
          <S.ProgressForm
            onClose={handleCloseProgressForm}
            workoutData={workoutData}
            userId={userId}
            progressColors={PROGRESS_BAR_COLORS}
            currentProgress={progressPercent}
          />
        )}

        <S.VideoPageTitle>{name}</S.VideoPageTitle>

        {embedUrl ? (
          <S.VideoContainer>
            <S.Video
              src={embedUrl}
              title={`Видео тренировки: ${name}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              aria-label="Видео тренировки"
            />
          </S.VideoContainer>
        ) : (
          <ErrorMessage message="Не удалось загрузить видео" />
        )}

        {exercises?.length > 0 ? (
          <S.ExerciseSection>
            <S.ExerciseWrapper>
              <S.ExerciseTitle>Упражнения</S.ExerciseTitle>
              <S.ExerciseList>
                {exercises.map(({ name, quantity }, index) => (
                  <S.ExerciseItem
                    key={`${name}-${index}`}
                    aria-label={`Упражнение: ${name}, ${quantity} повторений`}
                  >
                    {`${name} (${quantity} повторений)`}
                  </S.ExerciseItem>
                ))}
              </S.ExerciseList>
            </S.ExerciseWrapper>
          </S.ExerciseSection>
        ) : (
          <S.NoExercisesMessage>Упражнения отсутствуют</S.NoExercisesMessage>
        )}

        <S.ProgressButton onClick={handleOpenProgressForm}>
          Заполнить свой прогресс
        </S.ProgressButton>
      </S.VideoPage>
    </ErrorBoundary>
  );
};

TrainingVideoPage.propTypes = {
  // Добавить PropTypes при необходимости
};
