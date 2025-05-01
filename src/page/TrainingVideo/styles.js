import styled from "styled-components";

export const videoPage = styled.main`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
`;

export const videoPageTitle = styled.h1`
  font-size: 2rem;
  margin-bottom: 20px;
`;

export const video = styled.iframe`
  width: 100%;
  aspect-ratio: 16/9;
  border: none;
  border-radius: 8px;
`;

export const exercise = styled.section`
  margin: 30px 0;
`;

export const exerciseText = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 15px;
`;

export const exerciseLists = styled.ul`
  list-style-type: none;
  padding: 0;
`;

export const exerciseItem = styled.li`
  padding: 8px 0;
  border-bottom: 1px solid #eee;
`;

export const CompletionWrapper = styled.div`
  margin: 40px 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const CompleteButton = styled.button`
  background-color: ${(props) => (props.$completed ? "#4CAF50" : "#bcec30")};
  color: ${(props) => (props.$completed ? "#fff" : "#000")};
  border: none;
  border-radius: 46px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  align-self: center;

  &:hover {
    background-color: ${(props) => (props.$completed ? "#45a049" : "#a8d820")};
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export const SuccessText = styled.p`
  color: #4caf50;
  font-size: 16px;
  margin: 0;
`;

export const ErrorText = styled.p`
  color: #f44336;
  font-size: 16px;
  margin: 0;
`;

export const Loading = styled.div`
  text-align: center;
  padding: 40px;
  font-size: 18px;
  color: #666;
`;

export const InfoText = styled.p`
  color: #666;
  font-size: 16px;
  text-align: center;
  margin: 20px 0;
`;

export const exerciseWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
