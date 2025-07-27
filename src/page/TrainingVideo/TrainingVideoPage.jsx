import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as S from "./styles";
import { getWorkout, updateWorkoutProgress } from "../../api";
import { useAuth } from "../../hooks/use-auth";
import ErrorBoundary from "../../components/ErrorBoundary";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage";
import { ProgressForm } from "./ProgressForm";

/**
 * Функция для преобразования YouTube URL в embed-формат
 * @param {string} youtubeUrl - Ссылка на YouTube видео
 * @returns {string} URL для встраивания через iframe
 */
const getYoutubeEmbedUrl = (youtubeUrl) => {
  if (!youtubeUrl) return "";

  try {
    const url = new URL(youtubeUrl);
    const videoId = url.searchParams.get("v");
    return videoId
      ? `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&enablejsapi=1`
      : "";
  } catch (error) {
    console.error("Ошибка обработки YouTube URL:", error);
    return "";
  }
};

export const TrainingVideoPage = () => {
  // Состояния компонента
  const [isProgressFormOpen, setIsProgressFormOpen] = useState(false);
  const [workoutData, setWorkoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [exercisesProgress, setExercisesProgress] = useState({});

  // Получаем данные пользователя и параметры маршрута
  const { id: userId } = useAuth();
  const { courseId, workoutId } = useParams();
  const navigate = useNavigate();

  /**
   * Загружает данные тренировки с сервера
   * @async
   */
  const fetchWorkoutData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Запрашиваем данные с сервера
      const response = await getWorkout();

      // Проверяем структуру ответа
      if (!response?.courses || !response?.workouts) {
        throw new Error("Некорректный формат данных тренировки");
      }

      // Преобразуем данные в массивы (на случай, если Firebase вернет объект)
      const coursesArray = Array.isArray(response.courses)
        ? response.courses
        : Object.values(response.courses);
      const workoutsArray = Array.isArray(response.workouts)
        ? response.workouts
        : Object.values(response.workouts);

      // Находим нужный курс и тренировку
      const course = coursesArray.find((c) => c._id === courseId);
      if (!course) throw new Error(`Курс ${courseId} не найден`);

      const workout = workoutsArray.find((w) => w._id === workoutId);
      if (!workout) throw new Error(`Тренировка ${workoutId} не найдена`);

      // Проверяем, что у упражнений есть _id
      if (workout.exercises) {
        workout.exercises.forEach((ex, i) => {
          if (!ex._id) {
            console.warn(
              `Упражнение ${i} не имеет _id, будет использован индекс`
            );
            ex._id = `temp-${i}`; // Создаем временный id
          }
        });
      }

      // Получаем прогресс текущего пользователя
      const userData = workout.users?.find((u) => u.userId === userId) || {};

      // Рассчитываем общий прогресс на основе выполненных упражнений
      const exercisesProgress = userData.exercisesProgress || {};
      let totalProgress = 0;

      if (workout.exercises?.length > 0) {
        workout.exercises.forEach((exercise) => {
          const completed = exercisesProgress[exercise._id] || 0;
          const max = exercise.quantity || 1;
          totalProgress += (completed / max) * 100;
        });
        // Вычисляем средний прогресс по всем упражнениям
        totalProgress = Math.round(totalProgress / workout.exercises.length);
      }

      // Сохраняем данные в состоянии
      setWorkoutData({
        ...workout,
        courseName: course.nameRU,
        courseId: course._id,
      });

      setProgressPercent(totalProgress);
      setExercisesProgress(exercisesProgress);
    } catch (err) {
      console.error("Ошибка загрузки данных:", err);
      setError({
        message: err.message || "Неизвестная ошибка при загрузке данных",
        type: err.code === "NETWORK_ERROR" ? "network" : "application",
      });
    } finally {
      setLoading(false);
    }
  }, [courseId, workoutId, userId]);

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    fetchWorkoutData();
  }, [fetchWorkoutData]);

  /**
   * Обработчик открытия формы прогресса
   */
  const handleOpenProgressForm = () => {
    document.body.style.overflow = "hidden"; // Блокируем прокрутку страницы
    setIsProgressFormOpen(true);
  };

  /**
   * Обработчик закрытия формы прогресса
   */
  const handleCloseProgressForm = () => {
    document.body.style.overflow = "auto"; // Восстанавливаем прокрутку
    setIsProgressFormOpen(false);
  };

  /**
   * Сохраняет прогресс выполнения упражнений
   * @param {Object} exercisesProgress - Объект с прогрессом по упражнениям
   */
  const handleSaveProgress = async (exercisesProgress) => {
    try {
      // Рассчитываем новый общий прогресс
      let totalProgress = 0;
      if (workoutData.exercises?.length > 0) {
        workoutData.exercises.forEach((exercise) => {
          const completed = exercisesProgress[exercise._id] || 0;
          const max = exercise.quantity || 1;
          totalProgress += (completed / max) * 100;
        });
        totalProgress = Math.round(
          totalProgress / workoutData.exercises.length
        );
      }

      // Отправляем данные на сервер
      await updateWorkoutProgress({
        userId,
        courseId,
        workoutId,
        progress: totalProgress,
        exercisesProgress,
      });

      // Обновляем состояние
      setProgressPercent(totalProgress);
      setExercisesProgress(exercisesProgress);

      // Показываем уведомление о успешном сохранении
      if (totalProgress === 100) {
        console.log("Тренировка завершена!");
      }
    } catch (err) {
      console.error("Ошибка сохранения прогресса:", err);
    } finally {
      setIsProgressFormOpen(false);
    }
  };

  /**
   * Сбрасывает прогресс тренировки
   * @async
   */
  const handleResetProgress = async () => {
    try {
      // Создаем пустой объект прогресса
      const resetExercisesProgress = {};
      workoutData.exercises.forEach((exercise) => {
        resetExercisesProgress[exercise._id] = 0;
      });

      // Отправляем данные на сервер
      await updateWorkoutProgress({
        userId,
        courseId,
        workoutId,
        progress: 0,
        exercisesProgress: resetExercisesProgress,
      });

      // Обновляем состояние
      setProgressPercent(0);
      setExercisesProgress(resetExercisesProgress);
    } catch (err) {
      console.error("Ошибка сброса прогресса:", err);
    }
  };

  // Отображаем загрузку, если данные еще не получены
  if (loading) {
    return (
      <S.PageContainer>
        <S.LoadingContainer>
          <LoadingSpinner aria-label="Загрузка данных тренировки" />
        </S.LoadingContainer>
      </S.PageContainer>
    );
  }

  // Отображаем ошибку, если она есть
  if (error) {
    return (
      <S.PageContainer>
        <S.ErrorContainer>
          <ErrorMessage
            message={error.message}
            errorType={error.type}
            onRetry={fetchWorkoutData}
          />
          <S.BackButton onClick={() => navigate(-1)}>
            ← К списку тренировок
          </S.BackButton>
        </S.ErrorContainer>
      </S.PageContainer>
    );
  }

  // Если данные не загрузились
  if (!workoutData) {
    return (
      <S.PageContainer>
        <S.ErrorContainer>
          <ErrorMessage message="Данные тренировки недоступны" />
          <S.BackButton onClick={() => navigate(-1)}>
            ← К списку тренировок
          </S.BackButton>
        </S.ErrorContainer>
      </S.PageContainer>
    );
  }

  // Извлекаем необходимые данные
  const { name, video, exercises, courseName } = workoutData;
  const embedUrl = getYoutubeEmbedUrl(video);

  return (
    <ErrorBoundary>
      <S.PageContainer>
        {/* Модальное окно для ввода прогресса */}
        {isProgressFormOpen && (
          <ProgressForm
            onClose={handleCloseProgressForm}
            onSave={handleSaveProgress}
            workoutData={workoutData}
            currentExercisesProgress={exercisesProgress}
          />
        )}

        {/* Навигационная цепочка */}
        <S.Breadcrumbs aria-label="Навигационная цепочка">
          <S.BreadcrumbItem>
            <S.BreadcrumbLink to="/">Главная</S.BreadcrumbLink>
          </S.BreadcrumbItem>
          <S.BreadcrumbSeparator>/</S.BreadcrumbSeparator>
          <S.BreadcrumbItem>
            <S.BreadcrumbLink to="/profile">Профиль</S.BreadcrumbLink>
          </S.BreadcrumbItem>
          <S.BreadcrumbSeparator>/</S.BreadcrumbSeparator>
          <S.BreadcrumbItem>
            <S.BreadcrumbLink to={`/courses/${courseId}`}>
              {courseName}
            </S.BreadcrumbLink>
          </S.BreadcrumbItem>
          <S.BreadcrumbSeparator>/</S.BreadcrumbSeparator>
          <S.BreadcrumbItem $current>{name}</S.BreadcrumbItem>
        </S.Breadcrumbs>

        {/* Основной контент страницы */}
        <S.MainContent>
          {/* Заголовок страницы */}
          <S.PageHeader>
            <S.PageTitle>{name}</S.PageTitle>
          </S.PageHeader>

          {/* Секция с видео */}
          <S.VideoSection>
            {embedUrl ? (
              <S.VideoWrapper>
                <S.VideoPlayer
                  src={embedUrl}
                  title={`Видео тренировки: ${name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  frameBorder="0"
                  aria-label="Видео тренировки"
                />
              </S.VideoWrapper>
            ) : (
              <S.VideoPlaceholder>Видео недоступно</S.VideoPlaceholder>
            )}
          </S.VideoSection>

          {/* Секция с упражнениями */}
          <S.ExercisesSection>
            <S.SectionTitle>Упражнения тренировки</S.SectionTitle>

            {exercises?.length > 0 ? (
              <S.ExercisesList>
                {exercises.map((exercise, index) => {
                  // Рассчитываем прогресс для каждого упражнения
                  const completed = exercisesProgress[exercise._id] || 0;
                  const percentage = Math.round(
                    (completed / (exercise.quantity || 1)) * 100
                  );

                  return (
                    <S.ExerciseItem key={`ex-${exercise._id || index}`}>
                      <S.ExerciseHeader>
                        <S.ExerciseName>
                          {exercise.name}{" "}
                          <S.ExerciseReps>
                            {completed}/{exercise.quantity} ({percentage}%)
                          </S.ExerciseReps>
                        </S.ExerciseName>
                      </S.ExerciseHeader>
                      {exercise.description && (
                        <S.ExerciseDescription>
                          {exercise.description}
                        </S.ExerciseDescription>
                      )}
                      {/* Полоса прогресса */}
                      <S.ProgressBarContainer
                        role="progressbar"
                        aria-valuenow={percentage}
                        aria-valuemin="0"
                        aria-valuemax="100"
                      >
                        <S.ProgressBarFill $percentage={percentage} />
                      </S.ProgressBarContainer>
                    </S.ExerciseItem>
                  );
                })}
              </S.ExercisesList>
            ) : (
              <S.NoExercises>Упражнения не указаны</S.NoExercises>
            )}

            {/* Кнопка управления прогрессом */}
            <S.ProgressControl>
              {progressPercent === 100 ? (
                <S.ProgressButton onClick={handleResetProgress} $completed>
                  Начать заново
                </S.ProgressButton>
              ) : (
                <S.ProgressButton onClick={handleOpenProgressForm}>
                  {progressPercent === 0 && "Заполнить прогресс"}
                  {progressPercent > 0 &&
                    progressPercent < 100 &&
                    "Обновить прогресс"}
                </S.ProgressButton>
              )}
            </S.ProgressControl>
          </S.ExercisesSection>
        </S.MainContent>
      </S.PageContainer>
    </ErrorBoundary>
  );
};
