import * as S from "./style";

//Добавление компонента загрузки
export const LoadingSpinner = () => (
  <S.SpinnerContainer>
    <S.Spinner />
    <S.LoadingText>Loading...</S.LoadingText>
  </S.SpinnerContainer>
);
