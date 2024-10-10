import React from "react";
import * as S from "./style";
import { Header } from "../Header/Header";
import { Outlet } from "react-router-dom";
import { HeaderSkeleton } from "../../components/Skeletons/HeaderSkeleton";

export const PageLayout = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, []);

  return (
    <S.Wrapper>
      <S.Container>
        {isLoading ? <HeaderSkeleton /> : <Header />}
        <Outlet />
      </S.Container>
    </S.Wrapper>
  );
};
