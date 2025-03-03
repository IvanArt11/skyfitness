import { Link } from "react-router-dom";
import * as S from "./style";
import { useState } from "react";

export const TrainingBlock = ({ courses }) => {
  const [addedCourses, setAddedCourses] = useState(new Set());

  const handleAddCourse = (courseId) => {
    setAddedCourses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  return Object.values(courses).map((course) => (
    <S.SectionTraining key={course._id}>
      <S.AddButton
        onClick={() => handleAddCourse(course._id)}
        $isAdded={addedCourses.has(course._id)}
      >
        {addedCourses.has(course._id) ? (
          <S.AddedIcon src="/img/added-icon.svg" alt="Added" />
        ) : (
          <S.PlusIcon src="/img/plus-icon.svg" alt="Add" />
        )}
      </S.AddButton>

      <Link to={`/courses/${course._id}`}>
        <S.ImgTraining src={`/img/card-course/card-${course.nameEN}.jpg`} />
        {/* <S.TitleTraining>{course.nameRU}</S.TitleTraining> */}

        <S.TrainingContainer>
          <S.TitleTraining>{course.nameRU}</S.TitleTraining>
          <S.InfoContainer>
            <S.InfoItem>
              <S.InfoIcon src="/img/calendar-icon.svg" alt="Calendar" />
              {/* <S.InfoText>{course.duration} дней</S.InfoText> */}
              <S.InfoText>25 дней</S.InfoText>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoIcon src="/img/clock-icon.svg" alt="Clock" />
              {/* <S.InfoText>{course.timePerDay} мин/день</S.InfoText> */}
              <S.InfoText>20-50 мин/день</S.InfoText>
            </S.InfoItem>
            <S.InfoItem>
              <S.InfoIcon src="/img/difficulty-icon.svg" alt="Difficulty" />
              {/* <S.InfoText>{course.difficulty}</S.InfoText> */}
              <S.InfoText>Сложность</S.InfoText>
            </S.InfoItem>
          </S.InfoContainer>
        </S.TrainingContainer>
      </Link>
    </S.SectionTraining>
  ));
};
