import styled from "styled-components";

export const MainScills = styled.div`
  padding: 0 140px;
  @media (max-width: 768px) {
    padding: 20px;
  }
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 30px;
`;
export const ScillCard = styled.div`
  position: relative;
  width: 100%;
  margin-top: 75px;

  @media (max-width: 425px) {
    margin-top: 20px;
  }
`;
export const ScillImg = styled.img`
  width: 100%;
`;
export const ScillTitle = styled.h1`
  position: absolute;
  top: 40px;
  left: 40px;
  z-index: 10;
  color: #ffffff;
  font-size: 64px;
  font-style: normal;
  font-weight: 400;
  line-height: 72px;
  letter-spacing: -0.8px;

  @media (max-width: 768px) {
    font-size: 48px;
    line-height: 52px;
  }
  @media (max-width: 425px) {
    top: 15px;
    left: 15px;

    font-size: 26px;
    line-height: 32px;
  }
  @media (max-width: 375px) {
    font-size: 18px;
    line-height: 22px;
  }
`;
export const ScillDescription = styled.div`
  width: 100%;
  margin-top: 75px;
  @media (max-width: 768px) {
    margin-top: 15px;
  }
`;
export const ScillDescriptionTitle = styled.h2`
  color: #000;
  font-size: 40px;
  font-style: normal;
  font-weight: 600;
  line-height: 44px;

  @media (max-width: 767px) {
    font-size: 32px;
    line-height: 36px;
  }
  @media (max-width: 425px) {
    font-size: 22px;
    line-height: 26px;
  }
  @media (max-width: 375px) {
    font-size: 18px;
    line-height: 20px;
  }
`;
export const Description = styled.div`
  margin-top: 40px;
  display: flex;
  flex-wrap: wrap;
  column-gap: 10px;
  row-gap: 40px;
  justify-content: space-between;

  @media (max-width: 767px) {
    margin-top: 20px;
    flex-direction: column;
    align-items: start;
    row-gap: 20px;
  }
`;
export const Circle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 50%;
  background: #c7e957;
  display: flex;
  width: 45.6px;
  height: 45.6px;

  color: #000;
  font-size: 32px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px;

  @media (max-width: 767px) {
    width: 35px;
    height: 35px;

    font-size: 24px;
    line-height: 28px;
  }
  @media (max-width: 425px) {
    width: 25px;
    height: 25px;

    font-size: 14px;
    line-height: 16px;
  }
`;
export const DescriptionText = styled.p`
  color: #000;
  font-size: 40px;
  font-style: normal;
  font-weight: 600;
  line-height: 44px;
  ${'' /* width: 244px; */}

  @media (max-width: 767px) {
    width: 100%;
  }
  @media (max-width: 425px) {
    font-size: 20px;
    line-height: 24px;
  }
  @media (max-width: 375px) {
    font-size: 18px;
    line-height: 20px;
  }
`;
export const DescriptionTextOne = styled.div`
  display: flex;
  gap: 24px;

  @media (max-width: 425px) {
    gap: 10px;
  }
`;
export const DirectionConteiner = styled.div`
  margin-top: 75px;

  @media (max-width: 768px) {
    margin-top: 35px;
  }
`;
export const DirectionText = styled.h3`
  color: #000;
  font-size: 40px;
  font-style: normal;
  font-weight: 400;
  line-height: 48px;
`;
export const YogaDirection = styled.div`
  max-width: 1160px;
  margin-top: 22px;
  ${"" /* margin-left: 25px; */}
  display: flex;
  justify-content: space-between;
  background-color: #bcec30;
  border-radius: 28px;
  padding: 30px;
  height: 146px;

  @media (max-width: 768px) {
    width: calc(100% - 25px);
    height: 100%;
  }

  @media (max-width: 540px) {
    flex-direction: column;
  }
  @media (max-width: 425px) {
    margin-top: 12px;
  }
`;
export const YogaText = styled.li`
  color: #000;
  background: #BCEC30;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px;
  list-style-type: none; /* Убираем стандартные маркеры списка */
  padding-left: 30px; /* Отступ для фонового изображения */
  background-image: url('/img/Sparcle.svg');
  background-repeat: no-repeat;
  background-position: left center;
  background-size: 26px 26px; /* Размер фонового изображения */

  @media (max-width: 425px) {
    font-size: 18px;
    line-height: 25px;
  }
  @media (max-width: 375px) {
    font-size: 14px;
    line-height: 20px;
  }
`;
export const DiscriptionYoga = styled.div`
  margin-top: 75px;

  @media (max-width: 425px) {
    margin-top: 35px;
  }
`;
export const TextDiscriptionYoga = styled.p`
  color: #000;
  font-size: 24px;
  font-style: normal;
  font-weight: 400;
  line-height: 32px;
  width: 100%;

  @media (max-width: 768px) {
    font-size: 20px;
    line-height: 22px;
  }

  @media (max-width: 425px) {
    font-size: 18px;
    line-height: 20px;
  }
  @media (max-width: 375px) {
    font-size: 16px;
    line-height: 18px;
  }
  @media (max-width: 320px) {
    font-size: 14px;
    line-height: 16px;
  }
`;
export const RecordBox = styled.div`
  position: relative;
  margin-top: 75px;
  width: 100%;
  border-radius: 30px;
  background: #f9ebff;
  display: flex;
  flex-direction: column;
  padding: 46px 52px;

  @media (max-width: 425px) {
    padding: 26px 32px;
  }
`;
export const RecordText = styled.p`
  width: calc(100% - 300px);
  color: #000;
  font-size: 32px;
  font-style: normal;
  font-weight: 400;
  line-height: 40px;

  @media (max-width: 880px) {
    font-size: 26px;
    line-height: 28px;
  }

  @media (max-width: 768px) {
    width: 100%;
    font-size: 20px;
    line-height: 20px;
  }
  @media (max-width: 425px) {
    font-size: 16px;
    line-height: 20px;
  }
`;
export const btnRecord = styled.button`
  width: fit-content;
  border-radius: 46px;
  background: #580ea2;
  margin-top: 34px;
  border: 0;
  padding: 12px 24px;

  color: #fff;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.05px;

  :hover {
    background: #3f007d;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 16px;
    line-height: 18px;
  }

  @media (max-width: 425px) {
    font-size: 12px;
    line-height: 16px;
  }
`;
export const PhoneImg = styled.img`
  position: absolute;
  top: 10px;
  right: 0;
  @media (max-width: 768px) {
    display: none;
  }
`;
export const Direct = styled.ul`
  list-style-position: inside;
  -webkit-column-count: 2;
  gap: 124px;
  background: #BCEC30;
`;
export const goToProfile = styled.button`
  border-radius: 46px;
  background: #580ea2;
  margin-top: 34px;
  border: 0;
  padding: 12px 24px;

  color: #fff;
  font-size: 18px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  letter-spacing: -0.05px;

  :hover {
    background: #3f007d;
  }

  @media (max-width: 768px) {
    padding: 8px 12px;
    font-size: 16px;
    line-height: 18px;
  }

  @media (max-width: 425px) {
    font-size: 12px;
    line-height: 16px;
  }
`;
