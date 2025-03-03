import styled from "styled-components";

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
`;

export const ProfileAvatarImg = styled.img`
  width: 197px;
  height: 197px;

  @media (max-width: 480px) {
    width: 150px;
    height: 40px;
  }
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  gap: 30px;
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
  background-color: #580ea2;
  color: #fff;
  font-size: 18px;
  font-weight: 400;

  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: #3f007d;
  }
  &:active {
    background-color: #271a58;
  }
  &:disabled {
    opacity: 0.5;
  }
  @media (max-width: 480px) {
    font-size: 12px;
    padding: 8px 15px;
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
  margin-bottom: 50px;
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

export const CourseItems = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  gap: 20px;

  @media (max-width: 480px) {
    gap: 20px;
    justify-content: center;
  }
`;

export const Item = styled.div`
  position: relative;

  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: translateY(-5px);
  }
  @media (max-width: 620px) {
    width: 100%;
  }
`;

export const ItemTitle = styled.h2`
  position: absolute;
  font-size: 36px;
  top: 30px;
  left: 30px;

  @media (max-width: 800px) {
    font-size: 20px;
  }
`;

export const ItemImg = styled.img`
  width: 360px;
  height: 480px;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.1);
  border-radius: 30px;

  @media (max-width: 800px) {
    width: 270px;
    height: 360px;
  }
  @media (max-width: 620px) {
    width: 100%;
    height: auto;
  }
`;
export const GreenButton = styled.button`
  width: 136px;
  height: 43px;
  border: 0;
  border-radius: 80px;
  padding: 10px 15px;
  background-color: #c7e957;
  font-size: 20px;
  position: absolute;
  bottom: 30px;
  left: 30px;
  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: #daf289;
  }
  &:active {
    background-color: #ebffab;
  }
  @media (max-width: 480px) {
    font-size: 10px;
    width: 72px;
    height: 25px;
    padding: 0 5px;
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
  background-color: #580ea2;
  color: #fff;
  font-size: 18px;

  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: #3f007d;
  }
  &:active {
    background-color: #271a58;
  }
  &:disabled {
    opacity: 0.5;
  }
`;
