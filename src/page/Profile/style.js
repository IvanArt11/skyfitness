import styled from "styled-components";
import { Link } from "react-router-dom";

export const Personal = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

export const Name = styled.p`
  margin-left: 15px;
  margin-right: 12px;
`;

export const ProfileBlock = styled.div`
  margin-top: 75px;
  display: flex;
  flex-direction: column;
`;

export const Title = styled.h1`
  margin-bottom: 40px;
  font-size: 48px;
  color: #000;

  @media (max-width: 768px) {
    margin-bottom: 20px;
    font-size: 36px;
  }
  @media (max-width: 480px) {
    margin-bottom: 15px;
    font-size: 24px;
  }
`;

export const ProfileContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 33px;
  padding: 30px;
  background-color: #ffffff;
  border-radius: 30px;

  @media (max-width: 480px) {
    display: flex;
    justify-content: center;
  }
`;

export const ProfileAvatarImg = styled.img`
  width: 197px;
  height: 197px;

  @media (max-width: 480px) {
    width: 141px;
    height: 141px;
    background-color: inherit;
  }
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 10px;
  background-color: #ffffff;
`;

export const InfoBlock = styled.div`
  background-color: #ffffff;
`;

export const TextInfo = styled.p`
  margin-bottom: 20px;
  font-size: 24px;
  color: #000;
  background-color: #ffffff;

  @media (max-width: 768px) {
    margin-bottom: 12px;
    font-size: 20px;
  }
  @media (max-width: 480px) {
    margin-bottom: 8px;
    font-size: 16px;
  }
`;

export const ButtonBlock = styled.div`
  width: fit-content;
  display: flex;
  flex-direction: row;
  gap: 14px;
  justify-content: space-around;
  flex-wrap: wrap;
  background-color: inherit;

  @media (max-width: 768px) {
    margin-top: 15px;
  }
  @media (max-width: 480px) {
    margin-top: 12px;
    gap: 8px;
  }
`;

export const Button = styled.button`
  width: 192px;
  border: 0;
  border-radius: 46px;
  padding: 16px 26px;
  background-color: #bcec30 !important;
  color: #000000;
  font-size: 18px;
  font-weight: 400;

  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: #c6ff00 !important;
  }
  &:active {
    background-color: #000000 !important;
    color: #ffffff;
  }
  &:disabled {
    opacity: 0.5;
  }
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 16px 26px;
    width: 283px;
  }
`;

export const WarningMessage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 25px;
  width: 100%;
  color: tomato;
  border: 0;
  border-radius: 46px;
  border: 1px solid tomato;
  @media (max-width: 480px) {
    text-align: center;
    font-size: 12px;
    width: 150px;
    height: 36px;
    padding: 0 10px;
  }
`;

export const PopupLogin = styled.div`
  position: relative;
  width: fit-content;
  height: fit-content;
  border: 1px solid #d0cece;
  border-radius: 12px;
  padding: 33px 47px 47px 41px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  margin: 48px 0px 34px 0px;
  background-color: inherit;
`;

export const LoginLogo = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  background-color: transparent;
`;

export const TitleInput = styled.p`
  font-size: 18px;
  margin-top: 38px;
  background-color: inherit;
`;

export const TextExit = styled(TitleInput)`
  text-align: center;
  margin-bottom: 35px;
`;

export const Input = styled.input`
  width: 100%;
  border: none;
  border-bottom: 1px solid #d0cece;
  padding: 8px 5px;
  font-style: normal;
  font-size: 18px;

  &::placeholder {
    font-style: normal;

    font-size: 18px;
    color: #d0cece;
  }
`;

export const PopupPassword = styled(PopupLogin)`
  height: fit-content;
`;

export const CourseBlock = styled.div`
  margin-top: 61px;
`;

// Адаптивные стили
export const CourseItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  margin-top: 52px;

  @media (max-width: 1219px) {
    justify-content: center;
  }
  @media (max-width: 620px) {
    margin-top: 30px;
  }
`;

// Стили для карточек курсов
export const SectionTraining = styled.div`
  position: relative;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: translateY(-5px);
  }
  background-color: #ffffff;
  border-radius: 30px;
  padding-bottom: 15px;
  display: flex;
  flex-direction: column;
`;

export const ImgTraining = styled.img`
  max-width: 360px;
  max-height: 480px;
  box-shadow: 10px -10px 16px 0px #0000001a;
  border-radius: 30px;

  @media (max-width: 819px) and (min-width: 620px) {
    width: 260px;
  }
  @media (max-width: 620px) {
    width: 100%;
    font-size: 14px;
    line-height: 16px;
  }
`;

export const TrainingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 20px 0px 0px 20px;
  max-width: 300px;
  background-color: #ffffff;
`;

export const TitleTraining = styled.p`
  font-size: 36px;
  font-weight: 800;
  background-color: #ffffff;

  @media (max-width: 819px) {
    font-size: 22px;
    line-height: 24px;
  }
`;

export const InfoItems = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 10px;
  gap: 6px;
  background-color: #ffffff;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  background-color: #f7f7f7;
  padding: 10px;
  gap: 6px;
  border-radius: 50px;
`;

export const InfoIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;

export const InfoText = styled.span`
  font-size: 16px;
  color: #202020;
  font-weight: 400;
`;

export const AddButton = styled.button`
  position: absolute;
  background: none;
  top: 20px;
  right: 20px;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

export const BlackoutWrapper = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const PopupWorkout = styled.div`
  position: relative;
  width: fit-content;
  height: fit-content;
  border-radius: 12px;
  padding: 54px 36px;
  border: 1px solid #d0cece;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
`;

export const TitleWorkout = styled.h2`
  font-size: 32px;
  margin-bottom: 40px;
  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 20px;
  }
  @media (max-width: 480px) {
    font-size: 14px;
    margin-bottom: 8px;
  }
`;

export const ListWorkout = styled.ul`
  list-style-type: none;
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const WorkoutItem = styled.li`
  border: 1px solid #000;
  border-radius: 26px;
  padding: 15px;
  display: flex;
  justify-content: start;
  align-items: center;
  cursor: pointer;

  &:hover {
    background: #580ea2;
    color: #fff;
  }

  ${(props) =>
    props.$active &&
    `
    color: #06B16E;
    border: 1px solid #06B16E;
    `}
  @media (max-width: 768px) {
    padding: 10px;
    margin-bottom: 8px;
  }
  @media (max-width: 480px) {
    padding: 5px;
    margin-bottom: 5px;
  }
`;
export const WorkoutName = styled.h3`
  font-size: 20px;
  transition: 0.3s all;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-bottom: 8px;
  }
  @media (max-width: 480px) {
    font-size: 12px;
    margin-bottom: 3px;
  }
`;

export const WorkoutImg = styled.img`
  position: absolute;
  top: 10px;
  right: 15px;
  @media (max-width: 768px) {
    width: 20px;
    heigth: 20px;
  }
  @media (max-width: 480px) {
    top: 5px;
    right: 10px;
    width: 15px;
    heigth: 15px;
  }
`;

export const closeWindow = styled.img`
  position: absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
  width: 15px;
`;
export const viewAllCourses = styled.button`
  margin-top: 30px;
  width: fit-content;
  border: 0;
  border-radius: 46px;
  padding: 12px 41px;
  background-color: #bcec30 !important;
  color: #000000;
  font-size: 18px;

  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: #c6ff00 !important;
  }
  &:active {
    color: #ffffff;
    background-color: #000000 !important;
  }
  &:disabled {
    opacity: 0.5;
  }
`;

export const LoadingSpinner = styled.div`
  width: 30px;
  height: 30px;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #bcec30;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const RemoveButton = styled.button`
  position: absolute;
  background: ${(props) => (props.disabled ? "#f0f0f0" : "none")};
  top: 20px;
  right: 20px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? "wait" : "pointer")};
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: scale(1.1);
  }
`;

export const AddedIcon = styled.img`
  filter: brightness(0) invert(1);
  background: none;
`;

export const NoCoursesMessage = styled.div`
  font-size: 24px;
  color: #000;
  margin-top: 20px;

  @media (max-width: 768px) {
    font-size: 20px;
  }
  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

export const ProgressHeader = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 20px 0px 10px 0px;
  font-size: 18px;
  gap: 6px;
  color: #000000;
  background-color: #ffffff;
`;

export const ProgressPercent = styled.span`
  font-weight: 400;
  font-size: 18px;
  color: #000000;
`;

// Улучшаем стиль прогресс-бара
export const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #e0e0e0;
  border-radius: 4px;
  margin: 8px 0;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div`
  height: 100%;
  background-color: #00c1ff;
  border-radius: 4px;
  width: ${(props) => props.$progress}%;
  transition: width 0.3s ease;
`;

export const ProgressText = styled.span`
  position: absolute;
  right: 10px;
  font-size: 14px;
  color: #000;
`;

export const ProgressButton = styled(Link)`
  display: block;
  width: 100%;
  margin-top: 20px;
  padding: 12px 24px;
  background-color: #bcec30 !important;
  color: #000;
  text-align: center;
  border-radius: 46px;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #c6ff00 !important;
  }

  &:active {
    background-color: #000 !important;
    color: #fff;
  }
`;

// Стиль для состояния загрузки
export const Loading = styled.div`
  text-align: center;
  font-size: 18px;
  margin: 50px 0;
  color: #666;
`;

// Стиль для текста ошибки
export const ErrorText = styled.p`
  color: tomato;
  margin: -15px 0 15px;
  font-size: 14px;
`;

export const ErrorMessage = styled.div`
  padding: 20px;
  margin: 20px auto;
  max-width: 600px;
  background-color: #ffebee;
  color: #c62828;
  border-radius: 8px;
  text-align: center;
  font-size: 16px;
  border: 1px solid #ef9a9a;
`;

export const OfflineWarning = styled.div`
  padding: 10px 20px;
  background-color: #fff3e0;
  color: #e65100;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  font-size: 14px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;

  &:before {
    content: "⚠️";
    margin-right: 8px;
  }
`;
