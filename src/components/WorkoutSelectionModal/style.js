import styled from "styled-components";

export const BlackoutWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 20px;
`;

export const PopupWorkoutSelection = styled.div`
  position: relative;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  padding: 40px;
  animation: fadeIn 0.3s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 768px) {
    padding: 30px 20px;
    max-width: 90%;
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  svg {
    display: block;
  }
`;

export const ErrorMessage = styled.h2`
  font-size: 32px;
  font-weight: 400;
  color: #000000;
  margin: 0 0 48px 0;
  text-align: center;
  background: none;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 20px;
  }
`;

export const WorkoutSelectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 400;
  color: #000000;
  margin: 0 0 48px 0;
  text-align: center;
  background: none;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 20px;
  }
`;

export const WorkoutList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const WorkoutItem = styled.li`
  margin: 0;
`;

export const WorkoutButton = styled.button`
  width: 100%;
  padding: 16px 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 4px;

  &:hover {
    background: #FFFFFF;
    border-color: #bcec30;
    box-shadow: 0 2px 8px rgba(86, 94, 239, 0.1);
    transform: scale(1.01);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus-visible {
    outline: 2px solid #bcec30;
    outline-offset: 2px;
  }
`;

export const WorkoutNumber = styled.span`
  font-size: 24px;
  font-weight: 400;
  color: #000000;
  background: #ffffff;
`;

export const WorkoutName = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: #000000;
  background: #ffffff;
`;

export const EmptyMessage = styled.p`
  text-align: center;
  color: #666;
  padding: 20px 0;
  margin: 0;
`;
