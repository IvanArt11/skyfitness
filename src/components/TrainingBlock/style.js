import styled from "styled-components";

export const SectionTraining = styled.div`
  position: relative;
  transition: transform 0.3s ease-in-out;
  &:hover {
    transform: translateY(-5px);
  }
  background-color: #ffffff;
  border-radius: 30px;
  padding-bottom: 15px;
  display: flex;
  flex-direction: column;
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

export const TrainingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  flex-wrap: wrap;
  margin: 20px 0px 0px 20px;
  max-width: 300px;
  background-color: #ffffff;
`;

export const TitleTraining = styled.p`
  ${"" /* position: absolute; */}
  ${"" /* top: 30px; */}
  ${"" /* left: 30px; */}
  font-size: 36px;
  font-weight: 800;
  background-color: #ffffff;

  @media (max-width: 819px) {
    font-size: 22px;
    line-height: 24px;
  }
`;

export const InfoContainer = styled.div`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin-top: 10px;
  gap: 6px;
  background-color: #ffffff;
`;

export const InfoItem = styled.div`
  display: flex;
  align-items: center;
  background-color: #f7f7f7;
  padding: 10px;
  gap: 6px;
  border-radius: 50px;
`;

export const InfoIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 8px;
`;

export const InfoText = styled.span`
  font-size: 16px;
  color: #202020;
  font-weight: 400;
`;

export const AddButton = styled.button`
  position: absolute;
  background: none;
  top: 20px;
  right: 20px;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
  }
`;

export const PlusIcon = styled.img`
  filter: ${(props) => (props.$isAdded ? "brightness(0) invert(1)" : "none")};
  background: none;
`;

export const AddedIcon = styled.img`
  filter: brightness(0) invert(1);
  background: none;
`;
