import styled, { keyframes } from "styled-components";

export const HeaderSkeleton = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 30px;
  align-items: center;
`;

export const HeaderLogoSkeleton = styled.div`
  width: 280px;
  height: 30px;
  background-color: #aaa1ad;
  animation: loading 1s infinite alternate;
`;

export const PersonalsSkeleton = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const PersonalLogo = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #aaa1ad;
  position: relative;
`;

export const NameSkeleton = styled.div`
  width: 120px;
  height: 18px;
  background-color: #aaa1ad;
  animation: loading 1s infinite alternate;
`;

export const TrainingBlockSkeleton = styled.div`
  width: 350px;
  height: 470px;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  animation: loading 1s infinite alternate;
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  padding-top: 52px;
`;

export const loading = keyframes`
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
`;

export const ScillCard = styled.div`
  width: 1150px;
  height: 300px;
  flex-shrink: 0;
  border-radius: 30px;
  background: #aaa1ad;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 450px;
  @media (max-width: 768px) {
    width: 90%;
    margin-bottom: 80%;
  }
  @media (max-width: 480px) {
    width: 90%;
    margin-bottom: 60%;
  }
`;

export const RecordBox = styled.div`
  width: 100%;
  height: 300px;
  flex-shrink: 0;
  border-radius: 30px;
  background: #aaa1ad;
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 95px;
  @media (max-width: 768px) {
    width: 90%;
  }
  @media (max-width: 480px) {
    width: 90%;
  }
`;

export const TrainingPageSkeletonBlock = styled.div`
  margin-top: 95px;
`;
