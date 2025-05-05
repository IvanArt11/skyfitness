import styled from "styled-components";
import { devices } from "./breakpoints"; // Предполагается файл с медиа-запросами

export const VideoPage = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media ${devices.tablet} {
    padding: 1rem;
    gap: 1.5rem;
  }
`;

export const VideoPageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
  text-align: center;
  margin-bottom: 1rem;

  @media ${devices.tablet} {
    font-size: 1.5rem;
  }
`;

export const VideoContainer = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 соотношение */
  height: 0;
  overflow: hidden;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

export const Video = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

export const ExerciseSection = styled.section`
  background: ${({ theme }) => theme.backgroundPrimary};
  border-radius: 30px;
  padding: 40px;
  box-shadow: 0 4px 67px #00000021;
`;

export const ExerciseWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const ExerciseTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  background: ${({ theme }) => theme.backgroundPrimary};
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 0.5rem;

  @media ${devices.tablet} {
    font-size: 1.25rem;
  }
`;

export const ExerciseList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  list-style: none;
  padding: 0;
  margin: 0;
`;

export const ExerciseItem = styled.li`
  padding: 0.75rem 1rem;
  background: ${({ theme }) => theme.backgroundPrimary};
  border-radius: 8px;
  font-size: 1rem;
  color: ${({ theme }) => theme.textPrimary};
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
    color: white;
    transform: translateX(4px);
  }

  @media ${devices.tablet} {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
`;

export const NoExercisesMessage = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.textSecondary};
  font-size: 1rem;
  padding: 1.5rem;
`;

export const ProgressButton = styled.button`
  align-self: center;
  padding: 16px 26px;
  background: ${({ theme }) => theme.primary};
  color: ${({ theme }) => theme.textPrimary};
  border: none;
  border-radius: 46px;
  font-size: 18px;
  font-weight: 400;
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
    ${
      "" /* transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15); */
    }
  }

  &:active {
    background-color: ${({ theme }) => theme.backgroundSecondary};
    color: ${({ theme }) => theme.textSecondary};
  }

  @media ${devices.tablet} {
    padding: 0.6rem 1.2rem;
    font-size: 0.9rem;
  }
`;

// Стили для формы прогресса (ProgressForm)
export const ProgressFormBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

export const ProgressFormContainer = styled.div`
  background: ${({ theme }) => theme.backgroundPrimary};
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: relative;

  @media ${devices.tablet} {
    padding: 1.5rem;
  }
`;

export const ProgressFormTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.textPrimary};
  text-align: center;
`;

export const ProgressInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  background: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.textPrimary};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.primary};
    box-shadow: 0 0 0 2px rgba(86, 94, 239, 0.2);
  }
`;

export const ProgressSubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
  }
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.textSecondary};
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 50%;
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.textPrimary};
    background: ${({ theme }) => theme.backgroundTertiary};
  }
`;

export const ProgressForm = styled.div`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.textPrimary};
  text-align: center;
`;
