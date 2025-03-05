import { Header } from "../../components/Header/Header";
import { TrainingBlock } from "../../components/TrainingBlock/TrainingBlock";
import { HeaderSkeleton } from "../../components/Skeletons/HeaderSkeleton";
import { TrainingBlockSkeleton } from "../../components/Skeletons/TrainingBlockSkeleton";
import * as S from "./styles";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import ErrorBoundary from "../../components/ErrorBoundary";

// Константы для настройки
const LOADING_TIME = 1100; // Время имитации загрузки
const SKELETON_COUNT = 5; // Количество скелетонов

/**
 * Главная страница приложения.
 * @param {Object} courses - Данные курсов
 */
export const MainPage = ({ courses = {} }) => {
  const [isLoading, setIsLoading] = useState(true); // Состояние загрузки
  const [error, setError] = useState(null); // Состояние ошибки

  // Мемоизированный массив скелетонов для загрузки
  const skeletonBlocks = useMemo(
    () =>
      Array.from({ length: SKELETON_COUNT }).map((_, index) => (
        <TrainingBlockSkeleton
          key={`skeleton-${index}`}
          data-testid={`skeleton-block-${index}`}
        />
      )),
    []
  );

  // Прокрутка наверх страницы
  const handleClickGoToUp = useCallback(() => {
    try {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      // Fallback для браузеров без поддержки smooth scroll
      window.scrollTo(0, 0);
      console.error("Smooth scroll not supported:", err);
    }
  }, []);

  // Эффект для имитации загрузки и проверки данных
  useEffect(() => {
    // Проверка наличия курсов
    if (!courses || Object.keys(courses).length === 0) {
      setError("Курсы не найдены");
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => setIsLoading(false), LOADING_TIME);
    return () => clearTimeout(timer); // Очистка таймера при размонтировании
  }, [courses]); // добавлена зависимость courses

  // Компонент для отображения ошибки
  const renderErrorView = () => (
    <S.ErrorContainer data-testid="error-view">
      <S.ErrorMessage>{error}</S.ErrorMessage>
      <S.RetryButton onClick={() => window.location.reload()}>
        Попробовать снова
      </S.RetryButton>
    </S.ErrorContainer>
  );

  // Компонент для отображения загрузки
  const renderLoadingView = () => (
    <S.Wrapper data-testid="loading-view">
      <S.Container>
        <HeaderSkeleton />
        <S.TrainingBlock style={{ marginTop: "160px" }}>
          {skeletonBlocks}
        </S.TrainingBlock>
      </S.Container>
    </S.Wrapper>
  );

  // Компонент для отображения основного контента
  const renderMainContent = () => (
    <S.Wrapper data-testid="main-content">
      <Header isPurple={true} />
      <S.Container>
        <S.ContentDescription>
          <S.ContentDescriptionImg
            src="/img/sale-sticker.png"
            alt="Sale sticker"
            loading="lazy" // добавлена ленивая загрузка
          />
          <S.ContentDescriptionPreTitle>
            Онлайн-тренировки для занятий дома
          </S.ContentDescriptionPreTitle>
          <S.ContentDescriptionTitle>
            Начните заниматься спортом и улучшите качество жизни
          </S.ContentDescriptionTitle>
        </S.ContentDescription>
        <S.TrainingBlock>
          <ErrorBoundary>
            <TrainingBlock courses={courses} />
          </ErrorBoundary>
        </S.TrainingBlock>
        <S.ContentFooter>
          <S.ContentFooterButton
            onClick={handleClickGoToUp}
            aria-label="Прокрутить страницу наверх"
            data-testid="scroll-top-button"
          >
            Наверх
          </S.ContentFooterButton>
        </S.ContentFooter>
      </S.Container>
    </S.Wrapper>
  );

  // Условный рендеринг
  if (error) {
    return renderErrorView();
  }

  return isLoading ? renderLoadingView() : renderMainContent();
};

// Проверка типов пропсов
MainPage.propTypes = {
  courses: PropTypes.object.isRequired, // Меняем array на object
};

export default MainPage;
