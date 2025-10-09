import styled, { keyframes } from "styled-components";

// Анимация для спиннера
const spin = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

// Стили для спиннера
export const LoadingSpinner = styled.div`
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-top: 4px solid #580ea2; // Цвет спиннера
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
  margin: 0 auto; // Центрирование спиннера
`;

export const PageContainer = styled.div`
  max-width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.85);
`;

export const ModalForm = styled.div`
  width: 365px;
  background-color: #ffffff;
  border-radius: 12px;
  padding: 43px 47px 47px 40px;

  @media (max-width: 375px) {
    width: 100%;
  }
`;

export const ModalLogo = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 34px;
  background-color: transparent;
`;

export const ModalLogoImage = styled.img`
  width: 220px;
  height: 35px;
  background-color: inherit;
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

  @media (max-width: 375px) {
    width: 100%;
  }
`;

export const PrimaryButton = styled(Button)`
  color: #000000;
  background-color: #bcec30 !important;
  &:hover {
    background-color: #c6ff00 !important;
  }

  &:active {
    background-color: #000000 !important;
    color: #ffffff;
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
  background-color: inherit;
`;

export const Inputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  width: 100%;
  background-color: inherit;
`;

export const Error = styled.div`
  color: coral;
  font-weight: 400;
  font-size: 18px;
  line-height: 24px;
  margin-top: 20px;
  text-align: left;
`;

export const linkSingUp = styled.span`
  color: rgb(28 0 255);

  &:hover {
    text-decoration: underline;
  }
`;

export const FormTitle = styled.h2`
  color: #000;
  font-size: 20px;
  font-weight: 600;
  text-align: center;
  margin-bottom: 20px;
  background-color: inherit;
`;

export const PasswordInputContainer = styled.div`
  position: relative;
  width: 100%;
`;

export const ShowPasswordButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 16px;
  padding: 5px;
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};

  &:hover {
    opacity: ${(props) => (props.disabled ? 0.5 : 0.7)};
  }
`;

export const ForgotPasswordLink = styled.button`
  background: none;
  border: none;
  color: #009ee4;
  cursor: pointer;
  font-size: 14px;
  text-decoration: underline;
  margin: 10px 0;
  padding: 0;

  &:hover {
    color: #0080c0;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const HintSection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
  background-color: inherit;
`;

export const HintText = styled.div`
  background: #f0f8ff;
  border: 1px solid #b3d9ff;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
  font-size: 14px;
  color: #0066cc;
`;

export const HintInfo = styled.div`
  font-size: 12px;
  color: #666;
  margin: 5px 0 15px 0;
  text-align: center;
  background-color: inherit;
`;

export const SuccessMessage = styled.div`
  color: #2e8b57;
  background: #f0fff0;
  border: 1px solid #90ee90;
  border-radius: 5px;
  padding: 10px;
  margin: 10px 0;
  font-size: 14px;
`;

export const SupportSection = styled.div`
  margin-top: 20px;
  padding: 15px;
  background-color: #ffffff;
  border-radius: 5px;
`;

export const SupportTitle = styled.h4`
  color: #000;
  margin: 0 0 10px 0;
  font-size: 14px;
  background-color: #ffffff;
`;

export const SupportText = styled.p`
  color: #666;
  font-size: 12px;
  margin: 0;
  line-height: 1.4;
  background-color: #ffffff;
`;

export const LoginRedirect = styled.p`
  color: #000;
  text-align: center;
  margin: 15px 0 0 0;
  background-color: inherit;
`;

export const LinkSingUp = styled.span`
  color: #009ee4;
  text-decoration: none;

  &:hover {
    color: #0080c0;
    text-decoration: underline;
  }
`;

export const ModalLabel = styled.label`
  color: #000;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 5px;
  display: block;
  background-color: inherit;
`;
