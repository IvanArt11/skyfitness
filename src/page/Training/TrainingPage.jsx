import { Link, useNavigate, useParams } from "react-router-dom";
import * as S from "./styles";
import { TrainingSkillSkeleton } from "../../components/Skeletons/ТrainingSkillSkeleton";
import React, { useEffect, useState } from "react";
import { getWorkout } from "../../api";
import { useAuth } from "../../hooks/use-auth";

export const TrainingPage = ({ courses }) => {
  const [isLoading, setIsLoading] = React.useState(true);
  const [allCourses, setAllCoueses] = useState(null);
  const [dataCourse, setDataCourse] = useState(null);

  const navigate = useNavigate();
  const param = useParams();
  let scills = Object.values(courses).find((course) => course.id === param.id);

  const userId = useAuth().id;

  useEffect(() => {
    const fetchData = () => {
      getWorkout()
        .then((data) => {
          setAllCoueses(data);
          setIsLoading(false);
          for (let item in data) {
            if (data[item]._id === param.id) {
              setDataCourse(data[item]);
              setIsLoading(false);
            }
          }
        })
        .catch((error) => {
          console.error("Error fetching workout data:", error);
        });
    };
    fetchData();
  }, []);

  const fillEmptyArray = (num) => {
    const newArray = [];
    for (let i = 0; i < num; i++) {
      newArray.push(0);
    }
    return newArray;
  };

  const handleClickRecord = () => {
    const arrayCourses = [];
    courses[dataCourse._id].workout.forEach((item) => {
      arrayCourses.push(allCourses[item]);
    });

    const patchData = {};
    arrayCourses.forEach((course) => {
      const userToAdd = {
        progress: fillEmptyArray(
          course.exercises ? course.exercises.length : 1
        ),
        userId: userId,
      };
      patchData[`workout/${course.shortId}/users`] = [
        ...(course.users || []),
        userToAdd,
      ];
    });
    fetch(
      "https://fitness-pro-6b7ae-default-rtdb.europe-west1.firebasedatabase.app/.json",
      {
        method: "PATCH",
        body: JSON.stringify(patchData),
      }
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Ошибка при обновлении данных");
        }
        console.log("Данные успешно обновлены");
        navigate("/profile", { replace: true });
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      {isLoading ? (
        <>
          <TrainingSkillSkeleton />
        </>
      ) : (
        <>
          <S.ScillCard>
            <S.ScillImg src="/img/Group.jpg" alt="scill"></S.ScillImg>
            <S.ScillTitle>{scills?.name}</S.ScillTitle>
          </S.ScillCard>

          <S.ScillDescription>
            <S.ScillDescriptionTitle>
              Подойдет для вас, если:
            </S.ScillDescriptionTitle>

            <S.Description>
              <S.DescriptionTextOne>
                <S.Circle>1</S.Circle>
                <S.DescriptionText>{scills?.towards[0]}</S.DescriptionText>
              </S.DescriptionTextOne>

              <S.DescriptionTextOne>
                <S.Circle>2</S.Circle>
                <S.DescriptionText>{scills?.towards[1]}</S.DescriptionText>
              </S.DescriptionTextOne>

              <S.DescriptionTextOne>
                <S.Circle>3</S.Circle>
                <S.DescriptionText>{scills?.towards[2]}</S.DescriptionText>
              </S.DescriptionTextOne>
            </S.Description>
          </S.ScillDescription>

          <S.DirectionConteiner>
            <S.DescriptionText>Направления:</S.DescriptionText>
            <S.YogaDirection>
              <S.Direct>
                {scills?.directions.map((item, index) => (
                  <S.YogaText key={index}>{item}</S.YogaText>
                ))}
              </S.Direct>
            </S.YogaDirection>
          </S.DirectionConteiner>
          <S.DiscriptionYoga>
            <S.TextDiscriptionYoga>{scills?.description}</S.TextDiscriptionYoga>
          </S.DiscriptionYoga>

          {!dataCourse.users.find((obj) => obj.userId === userId) ? (
            <S.RecordBox>
              <S.RecordText>
                Оставьте заявку на пробное занятие, мы свяжемся с вами, поможем
                с выбором направления и тренера, с которым тренировки принесут
                здоровье и радость!
              </S.RecordText>

              <S.btnRecord onClick={handleClickRecord}>
                Записаться на тренировку
              </S.btnRecord>

              <S.PhoneImg src="/img/phone.svg" alt="phone" />
            </S.RecordBox>
          ) : (
            <Link to={"/profile"}>
              <S.goToProfile>перейти в профиль</S.goToProfile>
            </Link>
          )}
        </>
      )}
    </div>
  );
};
