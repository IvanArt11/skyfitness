export async function getCourses() {
  const response = await fetch(
    "https://skyfitnesspro-workout-default-rtdb.europe-west1.firebasedatabase.app/courses.json"
  ).catch((error) => {
    throw new Error("Не удалось загрузить список тренировок, попробуйте позже");
  });

  const data = await response.json();
  return data;
}

export async function getWorkout() {
  const response = await fetch(
    "https://skyfitnesspro-workout-default-rtdb.europe-west1.firebasedatabase.app/workout.json"
  ).catch((error) => {
    throw new Error("Не удалось загрузить список упражнений, попробуйте позже");
  });

  const data = await response.json();
  return data;
}
