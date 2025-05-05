import * as S from "./style";

export const ErrorMessage = ({ message, onRetry }) => (
  <S.ErrorContainer>
    <S.ErrorText>{message}</S.ErrorText>
    {onRetry && <S.RetryButton onClick={onRetry}>Попробовать снова</S.RetryButton>}
  </S.ErrorContainer>
);
