import { Link } from "react-router-dom";
import styled from "styled-components";

export const Header = styled.div`
  display: flex;
  width: 100%;
  max-width: 1160px;
  justify-content: space-between;
  align-items: center;
  padding-top: 30px;

  @media (max-width: 767px) {
    padding-top: 15px;
  }
`;

export const HeaderLogo = styled(Link)`
  display: flex;
`;

export const HeaderLogoImg = styled.img`
  @media (max-width: 480px) {
    width: 150px;
    height: 40px;
  }
`;

export const HeaderSectionButton = styled.div``;

export const HeaderButtonGreen = styled.button`
  width: 103px;
  height: 52px;
  border: none;
  border-radius: 46px;
  padding: 16px 26px;
  background-color: #bcec30; /* Зеленый цвет */
  color: #000; /* Черный текст */
  font-size: 18px;
  weight: 400;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #c6ff00; /* Светло-зеленый при наведении */
  }

  &:active {
    background-color: #000000;
    color: #ffffff;
  }
`;

export const HeaderButtonLink = styled(Link)``;

export const Personal = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
`;

export const PersonalMenu = styled.div`
  position: absolute;
  width: fit-content;
  width: 256px;
  overflow: hidden;
  background: #fff;
  border: 0;
  padding: 30px;
  top: 50px;
  right: 0;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 34px;

  border-radius: 30px;
  z-index: 100;
`;

export const ButtonBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

export const PersonalMenuButton = styled.button`
  border: 0;
  width: 206px;
  font-size: 18px;
  background: #BCEC30;
  border-radius: 46px;
  padding: 16px 26px;


  &:hover {
    background-color: #c6ff00;
  }
  &:active {
    color: #ffffff;
    background-color: #000000;
  }
  &:disabled {
    opacity: 0.5;
  }
`;

export const Name = styled.p`
  @media (max-width: 767px) {
    display: none;
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

export const PopupLogin = styled.div`
  position: relative;
  width: 100%;
  max-width: 320px;

  border: 1px solid #d0cece;
  border-radius: 12px;
  padding: 33px 47px 14px 41px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const closeWindow = styled.img`
  position: absolute;
  top: 10px;
  right: 15px;
  cursor: pointer;
  width: 15px;
`;

export const TextExit = styled.p`
  font-size: 18px;
  margin-top: 38px;
  text-align: center;
  margin-bottom: 35px;
  & b {
    color: #580ea2;
    text-decoration: underline;
  }
`;

export const Button = styled.button`
  width: 275px;
  height: 52px;
  border: none;
  border-radius: 46px;
  padding: 12px 43px;
  background-color: #580ea2;
  color: #fff;
  font-size: 18px;
  margin-bottom: 15px;
  transition: background-color 0.2s ease-in-out;
  &:hover {
    background-color: #3f007d;
  }
  &:active {
    background-color: #271a58;
  }
  @media (max-width: 480px) {
    font-size: 12px;
    width: 150px;
    height: 36px;
    padding: 0 15px;
  }
`;
