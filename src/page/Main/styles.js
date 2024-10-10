import styled from "styled-components";

export const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #271a58;
  padding: 0 30px;
`;
export const Container = styled.div`
  max-width: 1160px;
  height: 100%;
  padding: 35px 0;
  display: flex;
  flex-direction: column;

  @media (max-width: 1219px) {
    align-items: center;
  }
`;
export const ContentDescription = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 17px;
`;

export const ContentDescriptionPreTitle = styled.h3`
  font-size: 20px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);

  @media (max-width: 620px) {
    font-size: 14px;
    line-height: 16px;
  }
`;

export const ContentDescriptionTitle = styled.h1`
  font-size: 60px;
  font-weight: 400;
  line-height: 68px;
  color: #f4f4f4;
  max-width: 840px;

  @media (max-width: 1219px) {
    text-align: center;

  @media (max-width: 900px) {
    font-size: 52px;
    line-height: 58px;
  }
  @media (max-width: 819px) {
    font-size: 38px;
    line-height: 42px;
  }
  @media (max-width: 620px) {
    font-size: 32px;
    line-height: 38px;
  }
  @media (max-width: 425px) {
    font-size: 24px;
    line-height: 30px;
  }
`;

export const ContentDescriptionImg = styled.img`
  position: absolute;
  top: 18px;
  right: -45px;
  transform: rotate(15deg);

  @media (max-width: 1285px) {
    display: none;
  }
`;

export const TrainingBlock = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  margin-top: 52px;

  @media (max-width: 1219px) {
    justify-content: center;
  }
  @media (max-width: 620px) {
    margin-top: 30px;
  }
`;

export const ContentFooter = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 34px;
`;

export const ContentFooterButton = styled.button`
  width: 150px;
  height: 48px;
  border: 0;
  border-radius: 46px;
  background-color: #c7e957;
  font-size: 24px;
  font-weight: 400;
  color: #000;

  &:hover {
    background-color: #daf289;
  }

  &:active {
    background-color: #ebffab;
  }
`;
