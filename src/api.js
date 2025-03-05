export async function getCourses() {
  const response = await fetch(
    "https://fitness-pro-6b7ae-default-rtdb.europe-west1.firebasedatabase.app/courses.json"
  ).catch((error) => {
    throw new Error("Не удалось загрузить список тренировок, попробуйте позже");
  });

  const data = await response.json();
  return data;
}

export async function getWorkout() {
  try {
    const coursesResponse = await fetch(
      "https://fitness-pro-6b7ae-default-rtdb.europe-west1.firebasedatabase.app/courses.json"
    );
    const workoutsResponse = await fetch(
      "https://fitness-pro-6b7ae-default-rtdb.europe-west1.firebasedatabase.app/workouts.json"
    );

    if (!coursesResponse.ok || !workoutsResponse.ok) {
      throw new Error("Не удалось загрузить данные");
    }

    const courses = await coursesResponse.json();
    const workouts = await workoutsResponse.json();

    console.log("Данные курсов:", courses); // Проверка данных курсов
    console.log("Данные тренировок:", workouts); // Проверка данных тренировок

    return { courses, workouts };
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    throw error;
  }
}
