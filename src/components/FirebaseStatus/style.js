import styled from "styled-components";

export const StatusContainer = styled.div`
  padding: 20px;
  margin: 20px;
  border-radius: 8px;
  background-color: ${(props) => (props.hasError ? "#fff3f3" : "#f5f5f5")};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

export const StatusTitle = styled.h2`
  color: ${(props) => (props.hasError ? "#dc3545" : "#333")};
  margin-bottom: 16px;
`;

export const StatusList = styled.ul`
  list-style: none;
  padding: 0;
`;

export const StatusItem = styled.li`
  margin: 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ErrorMessage = styled.p`
  color: #dc3545;
  margin: 8px 0;
`;
