import { styled } from "styled-components";

export const videoPage = styled.main`
  margin-top: 75px;
  display: flex;
  flex-direction: column;
  gap: 40px;

  @media (max-width: 670px) {
    margin-top: 25px;
    gap: 20px;
  }
`;
export const videoPageWrap = styled.div`
  width: 100%;
  display: flex;
  gap: 40px;
  align-items: center;
  flex-direction: column;

  @media (max-width: 768px) {
    gap: 20px;
  }
  @media (max-width: 670px) {
    gap: 15px;
  }
`;
export const videoPageTitle = styled.h1`
  align-self: start;
  font-size: 48px;
  font-weight: 400;
  line-height: 56px;

  @media (max-width: 670px) {
    font-size: 32px;
    line-height: 40px;
  }
`;
export const breadcrumbs = styled.p`
  align-self: start;
  font-size: 32px;
  font-weight: 40;
  line-height: 40px;

  @media (max-width: 1000px) {
    font-size: 28px;
  }
  @media (max-width: 768px) {
    font-size: 18px;
    line-height: 20px;
  }
  @media (max-width: 670px) {
    font-size: 14px;
    line-height: 18px;
  }
  @media (max-width: 424px) {
    font-size: 12px;
    line-height: 16px;
  }
  @media (max-width: 374px) {
    font-size: 10px;
    line-height: 12px;
  }
`;
export const video = styled.iframe`
  aspect-ratio: 16/9;
  width: 100%;
  z-index: 10;
  border: 0;
`;
export const exercise = styled.div`
  margin-top: 45px;
  width: 100%;
  display: flex;
  gap: 60px;
  justify-content: space-between;

  @media (max-width: 1280px) and (min-width: 1000px) {
    gap: 30px;
  }
  @media (max-width: 1140px) {
    flex-wrap: wrap;
  }
  @media (max-width: 670px) {
    margin-top: 10px;
    gap: 30px;
  }
`;
export const exerciseWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
  min-width: 415px;

  @media (max-width: 670px) {
    gap: 18px;
    min-width: unset;
    width: 100%;
  }
`;
export const exerciseText = styled.div`
  font-size: 32px;
  font-weight: 400;
  line-height: 40px;

  @media (max-width: 1280px) and (min-width: 1000px) {
    font-size: 28px;
  }
  @media (max-width: 670px) {
    font-size: 22px;
    line-height: 30px;
  }
  @media (max-width: 374px) {
    font-size: 16px;
    line-height: 20px;
  }
`;

export const exerciseLists = styled.ul`
  padding-left: 35px;
  display: flex;
  flex-direction: column;
  @media (max-width: 670px) {
    gap: 20px;
  }
  @media (max-width: 374px) {
    gap: 10px;
  }
`;
export const exerciseItem = styled.li`
  font-size: 24px;
  font-weight: 400;
  line-height: 32px;

  @media (max-width: 1280px) and (min-width: 1000px) {
    font-size: 20px;
  }
  @media (max-width: 670px) {
    font-size: 16px;
    line-height: 18px;
  }
  @media (max-width: 374px) {
    font-size: 12px;
    line-height: 14px;
  }
`;

export const fillProgress = styled.button`
  width: fit-content;
  background-color: rgba(88, 14, 162, 1);
  padding: 12px 27px;
  border: 0;
  border-radius: 46px;

  color: rgba(250, 250, 250, 1);
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;

  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 1280px) and (min-width: 1000px) {
    font-size: 14px;
    line-height: 16px;
  }

  @media (max-width: 670px) {
    font-size: 14px;
    line-height: 16px;
  }

  @media (max-width: 374px) {
    font-size: 10px;
    line-height: 12px;
    padding: 8px 12px;
  }
`;
export const progressBar = styled.section`
  width: 638px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  gap: 40px;
  padding: 36px 50px;
  background-color: rgba(242, 242, 242, 1);
  border-radius: 30px;

  @media (max-width: 1280px) and (min-width: 1000px) {
    gap: 20px;
    padding: 20px 30px;
  }
  @media (max-width: 1140px) {
    width: 100%;
  }
  @media (max-width: 670px) {
    padding: 20px 30px;
    gap: 20px;
  }
`;

export const progressBarText = styled.p`
  text-align: center;
  font-size: 32px;
  font-weight: 400;
  line-height: 40px;

  @media (max-width: 1280px) and (min-width: 1000px) {
    font-size: 24px;
  }
  @media (max-width: 670px) {
    font-size: 17px;
    line-height: 26px;
  }
  @media (max-width: 374px) {
    font-size: 12px;
    line-height: 14px;
  }
`;
export const progressBarStats = styled.div`
  width: 100%;
  display: flex;
  gap: 26px;
  flex-direction: column;

  @media (max-width: 1280px) and (min-width: 1000px) {
    gap: 18px;
  }
  @media (max-width: 670px) {
    gap: 18px;
  }
  @media (max-width: 374px) {
    gap: 10px;
  }
`;
export const progressBarStat = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
`;

export const progressBarStatText = styled.p`
  width: 227px;
  font-size: 24px;
  font-weight: 400;
  line-height: 32px;

  @media (max-width: 1280px) and (min-width: 1000px) {
    width: 180px;
    font-size: 18px;
    line-height: 18px;
  }
  @media (max-width: 670px) {
    width: 140px;
    font-size: 14px;
    line-height: 18px;
  }
  @media (max-width: 374px) {
    width: 110px;
    font-size: 10px;
    line-height: 12px;
  }
`;
export const progressBarStatPercent = styled.div`
  position: relative;
  overflow: hidden;
  border: 2px solid rgb(${(props) => props.$rgbCode});

  width: 100%;
  max-width: calc(100% - 250px);
  height: 36px;

  display: flex;
  align-items: center;
  border-radius: 22px;

  @media (max-width: 1280px) and (min-width: 1000px) {
    max-width: calc(100% - 200px);
    height: 28px;
  }
  @media (max-width: 670px) {
    max-width: calc(100% - 150px);
    height: 20px;
  }
  @media (max-width: 374px) {
    max-width: calc(100% - 110px);
  }
`;

export const progressBarStatPercentFill = styled.div`
  width: ${(props) => props.$percent}%;
  height: 100%;
  background: rgb(${(props) => props.$rgbCode});
  position: relative;
`;

export const progressBarStatPercentFillNumber = styled.p`
  position: absolute;
  top: 0;
  ${(props) =>
    props.$percent < 30
      ? `right: -50px; color: #000;`
      : `right: 6px; color: #fff;`}
  font-size: 24px;
  font-weight: 400;
  line-height: 32px;

  @media (max-width: 1280px) and (min-width: 1000px) {
    font-size: 18px;
    line-height: 22px;
  }
  @media (max-width: 670px) {
    font-size: 14px;
    line-height: 16px;
  }
  @media (max-width: 424px) {
    font-size: 10px;
    line-height: 10px;
  }
`;

// progress form
export const progressFormWrap = styled.div`
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;
export const progressForm = styled.form`
  width: 444px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;

  background: #fff;
  z-index: 100;
  padding: 36px 41px;
  border-radius: 12px;
`;
export const progressFormText = styled.p`
  font-size: 32px;
  font-weight: 400;
  line-height: 40px;
`;

export const progressFormInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 30px;
`;
export const progressFormInputWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
export const progressFormInputText = styled.div`
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
`;
export const progressFormInput = styled.input`
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;

  border: 0;
  padding: 8px 0;
  outline: none;
  border-bottom: 1px solid rgba(208, 206, 206, 1);
  &::placeholder {
    color: rgba(208, 206, 206, 1);
  }

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &[type="number"] {
    -moz-appearance: textfield;
  }
`;
export const sendProgress = styled.button`
  font-size: 18px;
  font-weight: 400;
  line-height: 24px;
  color: #fff;

  width: 278px;
  height: 52px;
  background-color: rgba(88, 14, 162, 1);
  border: 0;
  border-radius: 46px;

  &:hover {
    opacity: 0.8;
  }
`;
export const done = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const doneText = styled.p`
  text-align: center;
  font-size: 40px;
  font-weight: 400;
  line-height: 48px;
`;

export const doneImg = styled.img`
  width: 250px;
  margin-bottom: -36px;
`;
