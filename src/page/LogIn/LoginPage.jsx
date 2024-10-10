import React from "react";
import * as S from "./styles";
import AuthPage from "../../components/Auth/Auth";

export const LoginPage = () => {
  return (
    <S.PageWrapper>
      <AuthPage isLoginMode={true} />
    </S.PageWrapper>
  );
};
