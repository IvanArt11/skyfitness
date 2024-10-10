import { Link } from "react-router-dom";
import styled from "styled-components";

export const SectionTraining = styled.div`
  position: relative;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: translateY(-5px);
  }
`;

export const ImgTraining = styled.img`
  max-width: 360px;
  max-height: 480px;
  box-shadow: 10px -10px 16px 0px #0000001a;
  border-radius: 30px;

  @media (max-width: 819px) and (min-width: 620px) {
    width: 260px;
  }
  @media (max-width: 620px) {
    width: 100%;
    font-size: 14px;
    line-height: 16px;
  }
`;
export const TitleTraining = styled.p`
  position: absolute;
  top: 30px;
  left: 30px;
  font-size: 36px;
  font-weight: 800;

  @media (max-width: 819px) {
    font-size: 22px;
    line-height: 24px;
  }
`;
