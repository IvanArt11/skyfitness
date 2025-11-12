import styled from "styled-components";

export const CompletionWrapper = styled.div`
  margin-top: 30px;
  text-align: center;
`;

export const CompleteButton = styled.button`
  background-color: #bcec30;
  border: none;
  border-radius: 46px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #a8d820;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const SuccessText = styled.p`
  color: #4caf50;
  margin-top: 10px;
`;

// Стиль для текста ошибки
export const ErrorText = styled.p`
  color: tomato;
  margin: -15px 0 15px;
  font-size: 14px;
`;
