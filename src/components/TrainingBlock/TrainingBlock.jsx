import { Link } from "react-router-dom";
import * as S from "./style";

export const TrainingBlock = ({ courses }) => {
  return Object.values(courses).map((course) => {
    return (
      <S.SectionTraining key={course._id}>
        <Link to={`/courses/${course._id}`}>
          <S.ImgTraining src={`/img/card-course/card-${course._id}.jpeg`} />
          <S.TitleTraining>{course.nameRU}</S.TitleTraining>
        </Link>
      </S.SectionTraining>
    );
  });
};
