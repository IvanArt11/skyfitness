import styled from "styled-components";
import { Link } from "react-router-dom";
import { devices } from "./breakpoints";

/**
 * Основные стили страницы
 */
export const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  @media ${devices.laptop} {
    padding: 1.5rem;
  }

  @media ${devices.tablet} {
    padding: 1rem;
    gap: 1.5rem;
  }
`;

/**
 * Стили для хлебных крошек
 */
export const Breadcrumbs = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.textSecondary};
`;

export const BreadcrumbItem = styled.span`
  ${({ $current }) =>
    $current &&
    `
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: ${(props) => (props.current ? props.theme.textPrimary : "inherit")};
    font-weight: ${(props) => (props.current ? "600" : "400")};
  `}
`;

export const BreadcrumbLink = styled(Link)`
  color: ${({ theme }) => theme.primary};
  text-decoration: none;
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.primaryHover};
    text-decoration: underline;
  }
`;

export const BreadcrumbSeparator = styled.span`
  color: ${({ theme }) => theme.textTertiary};
`;

/**
 * Основное содержимое страницы
 */
export const MainContent = styled.article`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

export const PageHeader = styled.header`
  text-align: center;
`;

export const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 0.5rem;

  @media ${devices.tablet} {
    font-size: 1.75rem;
  }
`;

/**
 * Секция с видео
 */
export const VideoSection = styled.section`
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

export const VideoWrapper = styled.div`
  position: relative;
  padding-bottom: 56.25%; /* 16:9 соотношение */
  height: 0;
`;

export const VideoPlayer = styled.iframe`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: none;
`;

export const VideoPlaceholder = styled.div`
  padding: 3rem;
  text-align: center;
  background: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.textSecondary};
  border-radius: 8px;
`;

/**
 * Секция с упражнениями
 */
export const ExercisesSection = styled.section`
  background: ${({ theme }) => theme.backgroundSecondary};
  border-radius: 30px;
  padding: 40px;
  box-shadow: 0 4px 67px rgba(0, 0, 0, 0.13);
`;

export const SectionTitle = styled.h2`
  font-size: 32px;
  font-weight: 400;
  color: ${({ theme }) => theme.textPrimary};
  margin-bottom: 20px;
  background: none;
`;

export const ExercisesList = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0;
  margin: 0;
  list-style: none;
`;

export const ExerciseItem = styled.li`
  background: ${({ theme }) => theme.backgroundPrimary};
  border-radius: 8px;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

export const ExerciseHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  background: none;
`;

// export const ExerciseIndex = styled.span`
//   font-weight: 700;
//   color: ${({ theme }) => theme.primary};
// `;

export const ExerciseName = styled.span`
  font-weight: 400;
  font-size: 18px;
  color: ${({ theme }) => theme.textPrimary};
  background: none;
`;

export const ExerciseReps = styled.span`
  color: ${({ theme }) => theme.textSecondary};
  font-weight: 400;
`;

export const ExerciseDescription = styled.p`
  color: ${({ theme }) => theme.textSecondary};
  line-height: 1.5;
  margin: 0;
  padding-left: 1.5rem;
`;

export const NoExercises = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.textTertiary};
  padding: 1rem;
`;

/**
 * Управление прогрессом
 */
export const ProgressControl = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

export const ProgressButton = styled.button`
  padding: 0.875rem 1.75rem;
  background: ${({ theme }) => theme.primary};
  color: white;
  border: none;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 200px;
  text-align: center;

  &:hover {
    background: ${({ theme }) => theme.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(86, 94, 239, 0.2);
  }

  &:disabled {
    background: ${({ theme }) => theme.success};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }

  @media ${devices.tablet} {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
  }
`;

/**
 * Состояния загрузки и ошибок
 */
export const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  text-align: center;
`;

export const BackButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: ${({ theme }) => theme.backgroundSecondary};
  color: ${({ theme }) => theme.textPrimary};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background: ${({ theme }) => theme.backgroundTertiary};
    border-color: ${({ theme }) => theme.primary};
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

export const ProgressForm = styled.div`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${({ theme }) => theme.textPrimary};
  text-align: center;
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
