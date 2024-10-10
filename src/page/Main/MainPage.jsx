import { HeaderPurple } from "../../components/Header/Header";
import { TrainingBlock } from "../../components/TrainingBlock/TrainingBlock";
import { HeaderSkeleton } from "../../components/Skeletons/HeaderSkeleton";
import { TrainingBlockSkeleton } from "../../components/Skeletons/TrainingBlockSkeleton";
import * as S from "./styles";
import React from "react";

export const MainPage = ({ courses }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const skeletonBlocks = Array(5)
    .fill()
    .map((_, index) => <TrainingBlockSkeleton key={index} />);
  const handleClickGoToUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading ? (
        <S.Wrapper>
          <S.Container>
            <HeaderSkeleton />
            <S.TrainingBlock style={{ marginTop: "160px" }}>
              {skeletonBlocks}
            </S.TrainingBlock>
          </S.Container>
        </S.Wrapper>
      ) : (
        <S.Wrapper>
          <HeaderPurple />
          <S.Container>
            <S.ContentDescription>
              <S.ContentDescriptionImg src="/img/sale-sticker.png" />
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
              <S.ContentFooterButton onClick={handleClickGoToUp}>
                Наверх
              </S.ContentFooterButton>
            </S.ContentFooter>
          </S.Container>
        </S.Wrapper>
      )}
    </>
  );
};
