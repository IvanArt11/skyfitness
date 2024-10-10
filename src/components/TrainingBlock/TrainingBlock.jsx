import { Link } from "react-router-dom";
import * as S from "./style";

export const TrainingBlock = ({ courses }) => {
  return Object.values(courses).map((course) => {
    return (
      <S.SectionTraining key={course.id}>
        <Link to={`/courses/${course.id}`}>
          <S.ImgTraining src={`/img/card-course/card-${course.id}.jpeg`} />
          <S.TitleTraining>{course.name}</S.TitleTraining>
        </Link>
      </S.SectionTraining>
    );
  });
};
