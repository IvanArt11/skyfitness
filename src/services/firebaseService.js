import { db } from "../firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { updateCourseProgress } from "../store/slices/userSlice";

export const completeWorkout = async (
  userId,
  courseId,
  workoutId,
  dispatch
) => {
  try {
    if (!userId || !courseId || !workoutId) {
      throw new Error("Недостаточно данных для сохранения");
    }

    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      [`progress.${courseId}.completedWorkouts`]: arrayUnion(workoutId),
      [`progress.${courseId}.lastUpdated`]: new Date(),
    });

    dispatch(updateCourseProgress({ courseId, workoutId }));
  } catch (error) {
    console.error("Firestore write error:", error);

    if (error.code === "resource-exhausted") {
      throw new Error("Слишком много запросов. Попробуйте позже.");
    } else if (error.code === "permission-denied") {
      throw new Error("Нет прав на запись. Авторизуйтесь снова.");
    } else {
      throw error;
    }
  }
};
