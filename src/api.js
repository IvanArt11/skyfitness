// Получение списка курсов
export async function getCourses() {
  try {
    const response = await fetch(
      "https://fitness-pro-6b7ae-default-rtdb.europe-west1.firebasedatabase.app/courses.json"
    );

    if (!response.ok) {
      throw new Error("Не удалось загрузить список курсов");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Ошибка при загрузке курсов:", error);
    throw error;
  }
}

// Получение данных тренировок
export async function getWorkout() {
  try {
    const [coursesResponse, workoutsResponse] = await Promise.all([
      fetch(
        "https://fitness-pro-6b7ae-default-rtdb.europe-west1.firebasedatabase.app/courses.json"
      ),
      fetch(
        "https://fitness-pro-6b7ae-default-rtdb.europe-west1.firebasedatabase.app/workouts.json"
      ),
    ]);

    if (!coursesResponse.ok || !workoutsResponse.ok) {
      throw new Error("Не удалось загрузить данные");
    }

    const courses = await coursesResponse.json();
    const workouts = await workoutsResponse.json();

    // Преобразуем объект в массив, если нужно
    const coursesArray = Array.isArray(courses)
      ? courses
      : Object.values(courses);
    const workoutsArray = Array.isArray(workouts)
      ? workouts
      : Object.values(workouts);

    return {
      courses: coursesArray,
      workouts: workoutsArray,
    };
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
    throw error;
  }
}

// Обновление прогресса тренировки
export const updateWorkoutProgress = async ({
  userId,
  courseId,
  workoutId,
  progress,
  exercisesProgress,
}) => {
  try {
    const response = await fetch(
      "https://fitness-pro-6b7ae-default-rtdb.europe-west1.firebasedatabase.app/workouts.json"
    );
    const workouts = await response.json();

    if (!response.ok) {
      throw new Error("Не удалось загрузить данные тренировок");
    }

    const workoutsArray = Array.isArray(workouts)
      ? workouts
      : Object.values(workouts);
    const updatedWorkouts = [...workoutsArray];
    const workoutIndex = updatedWorkouts.findIndex((w) => w._id === workoutId);

    if (workoutIndex === -1) {
      throw new Error("Тренировка не найдена");
    }

    // Обновляем или добавляем прогресс пользователя
    const userIndex =
      updatedWorkouts[workoutIndex].users?.findIndex(
        (u) => u.userId === userId
      ) ?? -1;
    const userData = {
      userId,
      progress,
      exercisesProgress,
      lastUpdated: new Date().toISOString(),
    };

    if (userIndex === -1) {
      updatedWorkouts[workoutIndex].users = [
        ...(updatedWorkouts[workoutIndex].users || []),
        userData,
      ];
    } else {
      updatedWorkouts[workoutIndex].users[userIndex] = userData;
    }

    // Отправляем обновленные данные
    const updateResponse = await fetch(
      "https://fitness-pro-6b7ae-default-rtdb.europe-west1.firebasedatabase.app/workouts.json",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedWorkouts),
      }
    );

    if (!updateResponse.ok) {
      throw new Error("Ошибка сохранения прогресса");
    }

    return await updateResponse.json();
  } catch (error) {
    console.error("Error updating workout progress:", error);
    throw error;
  }
};
