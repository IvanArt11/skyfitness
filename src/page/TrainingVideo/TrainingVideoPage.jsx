import { useEffect, useState } from "react";
import * as S from "./styles";
import { getWorkout } from "../../api";
import { useParams } from "react-router-dom";
import { useAuth } from "../../hooks/use-auth";

// чтобы прогресс бары были разными цветами
const colors = [
  "86, 94, 239",
  "255, 109, 0",
  "154, 72, 241",
  "101, 197, 5",
  "210 16 225",
];
export const TrainingVideoPage = () => {
  const [progressForm, setProgressForm] = useState(false);
  const [dataPage, setDataPage] = useState(null);
  const [progressPercent, setProgressPercent] = useState(null);

  const userId = useAuth().id;
  const currentPage = useParams().id;

  useEffect(() => {
    const fetchData = () => {
      getWorkout()
        .then((data) => {
          setDataPage(data[currentPage]);
        })
        .catch((error) => {
          console.error("Error fetching workout data:", error);
        });
    };

    fetchData();
  }, [currentPage]);

  useEffect(() => {
    setProgressPercent(
      dataPage?.users.find((obj) => obj.userId === userId)?.progress
    );
  }, [dataPage]);

  const handleClickFillProgress = () => {
    document.body.style.overflow = "hidden";
    setProgressForm(true);
  };

  function getYoutubeEmbedUrl(youtubeUrl) {
    let videoId = youtubeUrl.slice(17, youtubeUrl.length);
    const embedUrl = "https://www.youtube.com/embed/" + videoId;
    return embedUrl;
  }

  return dataPage ? (
    <S.videoPage>
      {progressForm && (
        <ProgressForm
          setProgressForm={setProgressForm}
          dataPage={dataPage}
          userId={userId}
        />
      )}
      <S.videoPageTitle>{dataPage.title}</S.videoPageTitle>
      <S.breadcrumbs>{dataPage.name}</S.breadcrumbs>

      <S.video src={getYoutubeEmbedUrl(dataPage.url)}></S.video>

      {/* нет упражнений - нет прогресса */}
      {dataPage.exercises && (
        <S.exercise>
          <S.exerciseWrap>
            <S.exerciseText>Упражнения</S.exerciseText>
            <S.exerciseLists>
              {dataPage.exercises.map((item, index) => (
                <S.exerciseItem
                  key={index}
                >{`${item.name} (${item.times} повторений)`}</S.exerciseItem>
              ))}
            </S.exerciseLists>
            {progressPercent && (
              <S.fillProgress onClick={handleClickFillProgress}>
                Заполнить свой прогресс
              </S.fillProgress>
            )}
          </S.exerciseWrap>

          {progressPercent && (
            <S.progressBar>
              <S.progressBarText>
                Мой прогресс по тренировке {dataPage.number}:
              </S.progressBarText>
              <S.progressBarStats>
                {dataPage.exercises.map((item, index) => (
                  <S.progressBarStat key={index}>
                    <S.progressBarStatText>{item.name}</S.progressBarStatText>
                    <S.progressBarStatPercent $rgbCode={colors[index]}>
                      <S.progressBarStatPercentFill
                        $percent={(progressPercent[index] * 100) / item.times}
                        $rgbCode={colors[index]}
                      >
                        <S.progressBarStatPercentFillNumber
                          $percent={(progressPercent[index] * 100) / item.times}
                        >
                          {`${Math.round(
                            (progressPercent[index] * 100) / item.times
                          )}%`}
                        </S.progressBarStatPercentFillNumber>
                      </S.progressBarStatPercentFill>
                    </S.progressBarStatPercent>
                  </S.progressBarStat>
                ))}
              </S.progressBarStats>
            </S.progressBar>
          )}
        </S.exercise>
      )}
    </S.videoPage>
  ) : (
    // тут должен быть скелетон
    <h1>Загрузка...</h1>
  );
};

const ProgressForm = ({ setProgressForm, dataPage, userId }) => {
  const [done, setDone] = useState(false);
  const progressArray = [];

  const closeForm = () => {
    document.body.style.overflow = null;
    setProgressForm(false);
  };

  // форма закроется, если кликнуть в любое пространство
  const handleClickSpace = () => {
    closeForm();
  };

  // чтобы не закрывалась, если кликнуть по форме
  const handleClickForm = (event) => {
    event.stopPropagation();
  };

  const handleChangeInput = (event, index) => {
    progressArray[index] = event.target.value;
  };

  const handleClickSubmit = (event) => {
    event.preventDefault();

    const newArrayUsers = [...dataPage.users];
    newArrayUsers.find((obj) => obj.userId === userId).progress = progressArray;

    const patchData = {};
    patchData[`workout/${dataPage.shortId}/users`] = newArrayUsers;

    fetch(
      "https://fitness-pro-6b7ae-default-rtdb.europe-west1.firebasedatabase.app/.json",
      {
        method: "PATCH",
        body: JSON.stringify(patchData),
      }
    ).then((response) => {
      if (!response.ok) {
        throw new Error("Ошибка при обновлении данных на сервере");
      }
      console.log("Данные успешно обновлены на сервере");
      setDone(true);
      setTimeout(() => {
        setDone(false);
        closeForm();
        window.location.reload();
      }, 1500);
    });
  };
  // без валидации
  return (
    <S.progressFormWrap onClick={handleClickSpace}>
      <S.progressForm onClick={(event) => handleClickForm(event)}>
        {done ? (
          <Done />
        ) : (
          <>
            <S.progressFormText>Мой прогресс</S.progressFormText>

            <S.progressFormInputs>
              {dataPage.exercises.map((item, index) => (
                <S.progressFormInputWrap key={index}>
                  <S.progressFormInputText>
                    {`Сколько раз вы сделали ${item.name.toLowerCase()}?`}
                  </S.progressFormInputText>
                  <S.progressFormInput
                    onChange={(event) => handleChangeInput(event, index)}
                    type="number"
                    name="quantity"
                    min="0"
                    placeholder="Введите значение"
                  />
                </S.progressFormInputWrap>
              ))}
            </S.progressFormInputs>

            <S.sendProgress onClick={(event) => handleClickSubmit(event)}>
              Отправить
            </S.sendProgress>
          </>
        )}
      </S.progressForm>
    </S.progressFormWrap>
  );
};

const Done = () => {
  return (
    <S.done>
      <S.doneText>Ваш прогресс засчитан!</S.doneText>
      <S.doneImg src="/img/VideoPage/done.png" alt="done" />
    </S.done>
  );
};
