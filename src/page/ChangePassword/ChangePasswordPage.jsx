import React from "react";
import * as S from "./styles";
import AuthPage from "../../components/ChangeAuth/ChangeAuth";

export const ChangePasswordPage = () => {
  return (
    <S.PageWrapper>
      <AuthPage isLoginChange={false} />
    </S.PageWrapper>
  );
};
