import React from "react";
import * as S from "./style";

export const HeaderSkeleton = () => {
  return (
    <S.HeaderSkeleton>
      <S.HeaderLogoSkeleton></S.HeaderLogoSkeleton>
      <S.PersonalsSkeleton>
        <S.PersonalLogo />
        <S.NameSkeleton />
      </S.PersonalsSkeleton>
    </S.HeaderSkeleton>
  );
};
