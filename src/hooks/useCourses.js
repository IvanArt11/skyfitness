import { useEffect, useState } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

/**
 * Хук для загрузки данных курсов из Firebase Realtime Database.
 * @returns {Object} Объект с данными курсов, состоянием загрузки и ошибкой.
 */
const useCourses = () => {
  const [courses, setCourses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const coursesRef = ref(db, "courses"); // Убедитесь, что путь "courses" правильный

    // Подписываемся на изменения данных
    const unsubscribe = onValue(
      coursesRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCourses(data);
        } else {
          setError("Данные не найдены");
        }
        setLoading(false);
      },
      (error) => {
        setError("Ошибка загрузки данных");
        setLoading(false);
      }
    );

    // Отписываемся при размонтировании компонента
    return () => unsubscribe();
  }, []);

  return { courses, loading, error };
};

export default useCourses;
