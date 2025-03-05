import { useEffect, useState, useCallback } from "react";
import * as S from "./styles";
import { getWorkout } from "../../api";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";
import ErrorBoundary from "../../components/ErrorBoundary"; // Импортируем Error Boundary

// Массив цветов для прогресс-бара
const colors = [
  "86, 94, 239",
  "255, 109, 0",
  "154, 72, 241",
  "101, 197, 5",
  "210, 16, 225",
];

// Компонент страницы тренировочного видео
export const TrainingVideoPage = () => {
  // Состояние формы прогресса
  const [progressForm, setProgressForm] = useState(false);

  // Состояние данных страницы
  const [dataPage, setDataPage] = useState(null);
  console.log("Данные тренировки:", dataPage);

  // Состояние процента прогресса
  const [progressPercent, setProgressPercent] = useState(null);

  // ID пользователя
  const userId = useAuth().id;
  console.log("userId:", userId);

  // ID текущей страницы
  const currentPage = useParams()._id;
  console.log("currentPage:", currentPage);

  // Функция для загрузки данных
  const fetchData = useCallback(async () => {
    try {
      const data = await getWorkout();
      console.log("Данные тренировки из API:", data); // Проверка данных

      if (!data || !data.courses || !data.workouts) {
        console.error("Ошибка загрузки данных: данные не найдены");
        return;
      }

      // Получаем курс по currentPage
      const course = data.courses?.[currentPage];
      if (!course) {
        console.error("Ошибка загрузки данных курса: курс не найден");
        return;
      }

      // Получаем тренировки для курса
      const workouts = course.workouts.map(
        (workoutId) => data.workouts?.[workoutId]
      );
      if (!workouts.length) {
        console.error(
          "Ошибка загрузки данных тренировок: тренировки не найдены"
        );
        return;
      }

      // Устанавливаем первую тренировку как dataPage
      setDataPage(workouts[0]);
    } catch (error) {
      console.error("Ошибка загрузки данных тренировки:", error);
    }
  }, [currentPage]);

  // Хук для загрузки данных при монтировании компонента
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Хук для обновления процента прогресса при изменении данных страницы
  useEffect(() => {
    if (dataPage) {
      console.log("Данные тренировки:", dataPage); // Проверка данных
      const userProgress = dataPage.users?.find(
        (obj) => obj.userId === userId
      )?.progress;
      console.log("Прогресс пользователя:", userProgress); // Проверка прогресса
      setProgressPercent(userProgress);
    }
  }, [dataPage, userId]);

  // Функция для открытия формы прогресса
  const handleClickFillProgress = () => {
    // Блокировка скролла страницы
    document.body.style.overflow = "hidden";
    // Открытие формы прогресса
    setProgressForm(true);
  };

  // Функция для получения URL-адреса видео на YouTube
  const getYoutubeEmbedUrl = (youtubeUrl) => {
    if (!youtubeUrl) {
      console.error("URL видео отсутствует");
      return ""; // Возвращаем пустую строку или URL-заглушку
    }

    try {
      const videoId = youtubeUrl.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } catch (error) {
      console.error("Ошибка при обработке URL видео:", error);
      return ""; // Возвращаем пустую строку или URL-заглушку
    }
  };

  // Если данные страницы не загружены, отображение сообщения о загрузке
  if (!dataPage) {
    return <h1>Загрузка...</h1>;
  }

  // Если данные загружены, но отсутствует видео или упражнения
  if (!dataPage.video) {
    return <p>Видео не найдено</p>;
  }

  if (!dataPage.exercises) {
    return <p>Упражнения отсутствуют</p>;
  }

  // Отображение страницы тренировочного видео
  return (
    <ErrorBoundary>
      <S.videoPage>
        {progressForm && (
          // Форма прогресса
          <S.progressForm
            setProgressForm={setProgressForm}
            dataPage={dataPage}
            userId={userId}
          />
        )}
        // Заголовок страницы
        <S.videoPageTitle>{dataPage.name}</S.videoPageTitle>
        // Видео
        <S.video src={getYoutubeEmbedUrl(dataPage.video)}></S.video>
        {/* нет упражнений - нет прогресса */}
        {dataPage.exercises ? (
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
          <p>Упражнения отсутствуют</p>
        )}
      </S.videoPage>
    </ErrorBoundary>
  );
};
