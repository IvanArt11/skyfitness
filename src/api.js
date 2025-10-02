import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  setDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "./firebase";

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
    console.log("Updating workout progress:", {
      userId,
      courseId,
      workoutId,
      progress,
      exercisesProgress,
    });

    // 1. Обновляем прогресс в профиле пользователя в Firestore
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // Создаем документ пользователя если не существует
      await setDoc(userRef, {
        courses: [],
        progress: {},
        createdAt: new Date(),
      });
    }

    // Подготавливаем данные для обновления прогресса
    const workoutProgressData = {
      progress: progress,
      exercisesProgress: exercisesProgress,
      lastUpdated: new Date().toISOString(),
    };

    // Обновляем прогресс в структуре users/{userId}/progress/{courseId}/workouts/{workoutId}
    await updateDoc(userRef, {
      [`progress.${courseId}.workouts.${workoutId}`]: workoutProgressData,
    });

    console.log("Progress updated successfully in user profile");

    // 2. Также обновляем прогресс в workouts (для обратной совместимости)
    try {
      const response = await fetch(
        "https://fitness-pro-6b7ae-default-rtdb.europe-west1.firebasedatabase.app/workouts.json"
      );
      const workouts = await response.json();

      if (response.ok) {
        const workoutsArray = Array.isArray(workouts)
          ? workouts
          : Object.values(workouts);
        const updatedWorkouts = [...workoutsArray];
        const workoutIndex = updatedWorkouts.findIndex(
          (w) => w._id === workoutId
        );

        if (workoutIndex !== -1) {
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
          await fetch(
            "https://fitness-pro-6b7ae-default-rtdb.europe-west1.firebasedatabase.app/workouts.json",
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(updatedWorkouts),
            }
          );
          console.log("Progress updated successfully in workouts");
        }
      }
    } catch (workoutError) {
      console.warn("Failed to update workouts (optional):", workoutError);
      // Игнорируем ошибку обновления workouts, так как основное хранилище - Firestore
    }

    return { success: true, message: "Прогресс успешно сохранен" };
  } catch (error) {
    console.error("Error updating workout progress:", error);
    throw new Error(`Не удалось сохранить прогресс: ${error.message}`);
  }
};

// Получение прогресса пользователя
export const getUserProgress = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return {};
    }

    const userData = userDoc.data();
    return userData.progress || {};
  } catch (error) {
    console.error("Error getting user progress:", error);
    throw error;
  }
};

// Добавление курса пользователю
export const addCourseToUser = async (userId, course) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        courses: [course],
        progress: {},
        createdAt: new Date(),
      });
    } else {
      await updateDoc(userRef, {
        courses: arrayUnion(course),
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error adding course to user:", error);
    throw error;
  }
};

// Удаление курса у пользователя
export const removeCourseFromUser = async (userId, courseId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const courseToRemove = userData.courses?.find((c) => c._id === courseId);

      if (courseToRemove) {
        await updateDoc(userRef, {
          courses: arrayRemove(courseToRemove),
          [`progress.${courseId}`]: deleteField(),
        });
      }
    }

    return { success: true };
  } catch (error) {
    console.error("Error removing course from user:", error);
    throw error;
  }
};
