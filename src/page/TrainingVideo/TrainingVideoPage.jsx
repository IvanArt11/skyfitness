import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as S from "./styles";
import { getWorkout } from "../../api";
import { useAuth } from "../../hooks/use-auth";
import ErrorBoundary from "../../components/ErrorBoundary";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner"; // Добавляем компонент загрузки
import { ErrorMessage } from "../../components/ErrorMessage/ErrorMessage"; // Добавляем компонент ошибки
import { ProgressForm } from "./ProgressForm";

/**
 * Цвета для прогресс-бара в формате RGB
 */
const PROGRESS_BAR_COLORS = [
  "86, 94, 239", // Основной синий
  "255, 109, 0", // Оранжевый
  "154, 72, 241", // Фиолетовый
  "101, 197, 5", // Зеленый
  "210, 16, 225", // Розовый
];

/**
 * Преобразует URL YouTube в embed-формат
 * @param {string} youtubeUrl - Полный URL видео на YouTube
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
      const response = await getWorkout();

      // Валидация структуры ответа
      if (!response?.courses || !response?.workouts) {
        throw new Error("Некорректный формат данных тренировки");
      }

      // Проверяем существование курса
      // const course = response.courses.find((c) => c._id === courseId);
      // if (!course) {
      //   throw new Error(`Курс ${courseId} не найден`);
      // }
      const coursesArray = Array.isArray(response.courses)
        ? response.courses
        : Object.values(response.courses);

      // Проверяем существование тренировки
      // const workout = response.workouts.find((w) => w._id === workoutId);
      // if (!workout) {
      //   throw new Error(`Тренировка ${workoutId} не найдена`);
      // }
      const workoutsArray = Array.isArray(response.workouts)
        ? response.workouts
        : Object.values(response.workouts);

      // Находим курс
      const course = coursesArray.find((c) => c._id === courseId);
      if (!course) {
        throw new Error(`Курс ${courseId} не найден`);
      }

      // Находим тренировку
      const workout = workoutsArray.find((w) => w._id === workoutId);
      if (!workout) {
        throw new Error(`Тренировка ${workoutId} не найдена`);
      }

      // Обогащаем данные тренировки
      setWorkoutData({
        ...workout,
        courseName: course.nameRU,
        courseId: course._id,
      });

      // Устанавливаем прогресс пользователя
      const userProgress =
        workout.users?.find((u) => u.userId === userId)?.progress || 0;
      setProgressPercent(userProgress);
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

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchWorkoutData();
  }, [fetchWorkoutData]);

  useEffect(() => {
    console.log("Параметры URL:", { courseId, workoutId });
    if (!courseId || !workoutId) {
      console.error("Отсутствуют необходимые параметры в URL");
      navigate("/profile"); // или другая подходящая страница
    }
  }, [courseId, workoutId]);

  /**
   * Обработчик открытия формы прогресса
   */
  const handleOpenProgressForm = () => {
    document.body.style.overflow = "hidden";
    setIsProgressFormOpen(true);
  };

  /**
   * Обработчик закрытия формы прогресса
   */
  const handleCloseProgressForm = () => {
    document.body.style.overflow = "auto";
    setIsProgressFormOpen(false);
    fetchWorkoutData(); // Обновляем данные
  };

  /**
   * Возврат к списку тренировок
   */
  const handleBackToWorkouts = () => {
    navigate(`/courses/${courseId}/workouts`);
  };

  // Состояние загрузки
  if (loading) {
    return (
      <S.PageContainer>
        <S.LoadingContainer>
          <LoadingSpinner aria-label="Загрузка данных тренировки" />
        </S.LoadingContainer>
      </S.PageContainer>
    );
  }

  // Состояние ошибки
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

  // Данные не загружены
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
        {/* Модальное окно прогресса */}
        {isProgressFormOpen && (
          <ProgressForm
            onClose={handleCloseProgressForm}
            workoutData={workoutData}
            userId={userId}
            progressColors={PROGRESS_BAR_COLORS}
            currentProgress={progressPercent}
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

        {/* Основной контент */}
        <S.MainContent>
          {/* Заголовок */}
          <S.PageHeader>
            <S.PageTitle>{name}</S.PageTitle>
          </S.PageHeader>

          {/* Видеоплеер */}
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

          {/* Список упражнений */}
          <S.ExercisesSection>
            <S.SectionTitle>Упражнения тренировки</S.SectionTitle>

            {exercises?.length > 0 ? (
              <S.ExercisesList>
                {exercises.map((exercise, index) => (
                  <S.ExerciseItem key={`ex-${index}`}>
                    <S.ExerciseHeader>
                      {/* <S.ExerciseIndex>{index + 1}.</S.ExerciseIndex> */}
                      <S.ExerciseName>
                        {exercise.name}{" "}
                        <S.ExerciseReps>({exercise.quantity})</S.ExerciseReps>
                      </S.ExerciseName>
                    </S.ExerciseHeader>
                    {exercise.description && (
                      <S.ExerciseDescription>
                        {exercise.description}
                      </S.ExerciseDescription>
                    )}
                  </S.ExerciseItem>
                ))}
              </S.ExercisesList>
            ) : (
              <S.NoExercises>Упражнения не указаны</S.NoExercises>
            )}
          </S.ExercisesSection>

          {/* Кнопка управления прогрессом */}
          <S.ProgressControl>
            <S.ProgressButton
              onClick={handleOpenProgressForm}
              disabled={progressPercent === 100}
            >
              {progressPercent === 0 && "Начать тренировку"}
              {progressPercent > 0 &&
                progressPercent < 100 &&
                `Прогресс: ${progressPercent}%`}
              {progressPercent === 100 && "Тренировка завершена"}
            </S.ProgressButton>
          </S.ProgressControl>
        </S.MainContent>
      </S.PageContainer>
    </ErrorBoundary>
  );
};

TrainingVideoPage.propTypes = {
  // Добавить PropTypes при необходимости
};
