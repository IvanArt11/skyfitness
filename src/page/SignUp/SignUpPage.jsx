import React from "react";
import * as S from "./styles";
import AuthPage from "../../components/Auth/Auth";

export const SignUpPage = () => {
  return (
    <S.PageWrapper>
      <AuthPage isLoginMode={false} />
    </S.PageWrapper>
  );
};
