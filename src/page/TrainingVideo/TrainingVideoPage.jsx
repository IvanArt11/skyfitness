import { useEffect, useState, useCallback } from "react";
import * as S from "./styles";
import { getWorkout } from "../../api";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import ErrorBoundary from "../../components/ErrorBoundary";
import { WorkoutCompletion } from "../../services/WorkoutCompletion";
import { useDispatch } from "react-redux";

// Компонент страницы тренировочного видео
export const TrainingVideoPage = () => {
  // Состояние данных страницы
  const [dataPage, setDataPage] = useState(null);
  console.log("Данные тренировки:", dataPage);
  // Состояние процента прогресса
  const [progressPercent, setProgressPercent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const params = useParams();
  // ID пользователя
  const { id: userId } = useAuth();
  console.log("userId:", userId);
  const dispatch = useDispatch();

  const courseId = params.courseId;
  const workoutId = params.workoutId || params._id;

  // Функция для загрузки данных
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getWorkout();
      console.log("Данные тренировки из API:", data); // Проверка данных

      // Проверяем структуру данных
      if (!data || !Array.isArray(data.courses)) {
        throw new Error("Неверный формат данных");
      }

      // Получаем курс
      const course = data.courses.find((c) => c._id === courseId);
      if (!course) {
        throw new Error("Курс не найден");
      }

      // Получаем тренировки для курса
      const workout = course.workouts?.find((w) => w._id === workoutId);
      if (!workout) {
        throw new Error("Тренировка не найдена");
      }

      setDataPage({ ...workout, courseName: course.name });
      setError(null);
    } catch (err) {
      console.error("Ошибка загрузки:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [courseId, workoutId]);

  // Хук для загрузки данных при монтировании компонента
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Хук для обновления процента прогресса при изменении данных страницы
  useEffect(() => {
    if (dataPage && userId) {
      console.log("Данные тренировки:", dataPage); // Проверка данных
      const userProgress = dataPage.users?.find(
        (u) => u.userId === userId
      )?.progress;
      console.log("Прогресс пользователя:", userProgress); // Проверка прогресса
      setProgressPercent(userProgress || []);
    }
  }, [dataPage, userId]);

  const handleWorkoutComplete = () => {
    setProgressPercent((prev) => [...(prev || []), 100]);
  };

  // Функция для получения URL-адреса видео на YouTube
  const getYoutubeEmbedUrl = (url) => {
    if (!url) return ""; // Возвращаем пустую строку или URL-заглушку
    try {
      const videoId = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } catch {
      return ""; // Возвращаем пустую строку или URL-заглушку
    }
  };

  // Если данные страницы не загружены, отображение сообщения о загрузке
  if (loading) return <S.Loading>Загрузка...</S.Loading>;
  if (error) return <S.ErrorText>{error}</S.ErrorText>;
  if (!dataPage) return <S.ErrorText>Данные не загружены</S.ErrorText>;

  // Отображение страницы тренировочного видео
  return (
    <ErrorBoundary>
      <S.videoPage>
        <S.videoPageTitle>{dataPage.name}</S.videoPageTitle>
        // Видео
        <S.video
          src={getYoutubeEmbedUrl(dataPage.video)}
          title="Видео тренировки"
          allowFullScreen
        />
        {/* нет упражнений - нет прогресса */}
        {dataPage.exercises?.length > 0 ? (
          // Блок упражнений
          <S.exercise>
            <S.exerciseWrap>
              // Заголовок упражнений
              <S.exerciseText>Упражнения</S.exerciseText>
              // Список упражнений
              <S.exerciseLists>
                {dataPage.exercises.map((item, index) => (
                  // Элемент упражнения
                  <S.exerciseItem key={index}>
                    {`${item.name} (${item.quantity} повторений)`}
                  </S.exerciseItem>
                ))}
              </S.exerciseLists>
            </S.exerciseWrap>
          </S.exercise>
        ) : (
          <S.InfoText>Нет данных об упражнениях</S.InfoText>
        )}
        <WorkoutCompletion
          courseId={courseId}
          workoutId={workoutId}
          onComplete={handleWorkoutComplete}
          isCompleted={progressPercent?.includes(100)}
        />
      </S.videoPage>
    </ErrorBoundary>
  );
};
