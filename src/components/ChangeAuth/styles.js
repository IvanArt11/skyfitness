import styled from "styled-components";

export const PageContainer = styled.div`
  max-width: 100%;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.85);
`;

export const ModalForm = styled.div`
  --modal-width: 366px;
  --modal-height: 439px;

  position: absolute;
  left: calc(50% - (var(--modal-width) / 2));
  top: calc(50% - (var(--modal-height) / 2));
  box-sizing: border-box;
  width: var(--modal-width);
  min-height: var(--modal-height);
  background-color: #ffffff;
  border-radius: 12px;
  padding: 43px 47px 47px 40px;
`;
export const ModalLogo = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 34px;
  background-color: transparent;
`;

export const ModalLogoImage = styled.img`
  width: 140px;
  height: 21px;
`;
export const ModalLabel = styled.div`
  color: black;
  text-align: start;
  font-family: "StratosSkyeng", sans-serif;
  font-weight: 400;
  font-size: 18px;
`;

export const ModalInput = styled.input`
  width: 100%;
  border: none;
  border-bottom: 1px solid #d0cece;
  padding: 8px 1px;

  &::placeholder {
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 24px;
    color: #d0cece;
  }
`;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;

  width: 278px;
  height: 52px;
  border-radius: 46px;
  border: none;
  font-style: normal;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;

  &:disabled {
    background-color: #303030;
  }
`;

export const PrimaryButton = styled(Button)`
  color: #ffffff;
  background-color: #580ea2;
  &:hover {
    background-color: #3f007d;
  }

  &:active {
    background-color: #271a58;
  }
`;
export const SecondaryButton = styled(Button)`
  color: #000000;
  background-color: transparent;
  border: 1px solid #d0cece;

  &:hover {
    background-color: #f4f5f6;
  }

  &:active {
    background-color: #d9d9d9;
  }
`;

export const Buttons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 60px;
  width: 100%;
`;

export const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
`;

export const Error = styled.div`
  color: coral;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  margin-top: 20px;
  text-align: left;
`;

// Добавьте эти стили в ваш styles.js файл

export const UserInfo = styled.div`
  background: #f0f8ff;
  border: 1px solid #b3d9ff;
  border-radius: 5px;
  padding: 15px;
  margin-bottom: 20px;
`;

export const PasswordRequirements = styled.div`
  background: #fff8e1;
  border: 1px solid #ffecb3;
  border-radius: 5px;
  padding: 15px;
  margin: 15px 0;
`;

export const SecurityWarning = styled.div`
  background: #fff0f0;
  border: 1px solid #ffcccc;
  border-radius: 5px;
  padding: 15px;
  margin-top: 20px;
`;

// Если этих стилей еще нет, добавьте их:
export const SuccessMessage = styled.div`
  color: #2e8b57;
  background: #f0fff0;
  border: 1px solid #90ee90;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
  font-size: 14px;
`;

export const InfoText = styled.p`
  color: #666;
  font-size: 14px;
  margin: 5px 0;
  line-height: 1.4;
`;

export const SupportTitle = styled.h4`
  color: #000;
  margin: 0 0 10px 0;
  font-size: 14px;
`;

export const SupportText = styled.p`
  color: #666;
  font-size: 12px;
  margin: 0;
  line-height: 1.4;
`;
