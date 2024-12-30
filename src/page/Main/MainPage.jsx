import { HeaderPurple } from "../../components/Header/Header";
import { TrainingBlock } from "../../components/TrainingBlock/TrainingBlock";
import { HeaderSkeleton } from "../../components/Skeletons/HeaderSkeleton";
import { TrainingBlockSkeleton } from "../../components/Skeletons/TrainingBlockSkeleton";
import * as S from "./styles";
import React, { useEffect, useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";

export const MainPage = ({ courses }) => {
  // Состояния компонента
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null); 

  // Константы
  const LOADING_TIME = 1100;
  const SKELETON_COUNT = 5;

  // Создаем мемоизированный массив скелетонов
  const skeletonBlocks = useMemo(
    () =>
      Array(SKELETON_COUNT)
        .fill(null)
        .map((_, index) => (
          <TrainingBlockSkeleton
            key={`skeleton-${index}`}
            data-testid={`skeleton-block-${index}`}
          />
        )),
    [SKELETON_COUNT]
  );

  // Обработчик прокрутки наверх страницы
  const handleClickGoToUp = useCallback(() => {
    try {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      // Fallback для браузеров, не поддерживающих smooth scroll
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

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, LOADING_TIME);

    return () => clearTimeout(timer);
  }, [courses]); // добавлена зависимость courses

  // Компонент отображения ошибки
  const ErrorView = () => (
    <S.ErrorContainer data-testid="error-view">
      <S.ErrorMessage>{error}</S.ErrorMessage>
      <S.RetryButton onClick={() => window.location.reload()}>
        Попробовать снова
      </S.RetryButton>
    </S.ErrorContainer>
  );

  // Компонент загрузки
  const LoadingView = () => (
    <S.Wrapper data-testid="loading-view">
      <S.Container>
        <HeaderSkeleton />
        <S.TrainingBlock style={{ marginTop: "160px" }}>
          {skeletonBlocks}
        </S.TrainingBlock>
      </S.Container>
    </S.Wrapper>
  );

  // Основной контент
  const MainContent = () => (
    <S.Wrapper data-testid="main-content">
      <HeaderPurple />
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
          <TrainingBlock courses={courses} />
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
    return <ErrorView />;
  }

  return isLoading ? <LoadingView /> : <MainContent />;
};

// Более детальная проверка типов пропсов
MainPage.propTypes = {
  courses: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    description: PropTypes.string,
    // Добавьте другие необходимые поля
  }),
};

MainPage.defaultProps = {
  courses: {},
};

export default MainPage;
