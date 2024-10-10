import React from "react";
import * as S from "./styles";
import AuthPage from "../../components/ChangeAuth/ChangeAuth";

export const ChangeLoginPage = () => {
  return (
    <S.PageWrapper>
      <AuthPage isLoginChange={true} />
    </S.PageWrapper>
  );
};
