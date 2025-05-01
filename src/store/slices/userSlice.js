import { createSlice } from "@reduxjs/toolkit";

// Начальное состояние для пользователя
const initialState = {  
  login: null,
  password: null,
  email: null,
  token: null,
  id: null,
  courses: [], // Список курсов пользователя
  progress: {},
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Установка данных пользователя при авторизации
    setUser(state, action) {
      state.login = action.payload.login;
      state.password = action.payload.password;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.id = action.payload.id;
    },

    // Очистка данных при выходе
    removeUser(state) {
      state.login = null;
      state.password = null;
      state.email = null;
      state.token = null;
      state.id = null;
      state.courses = [];
      state.progress = {};
    },

    // Обновление логина
    setNewLogin(state, action) {
      state.login = action.payload;
    },

    // Обновление пароля
    setNewPassword(state, action) {
      state.password = action.payload;
    },

    // Добавление нового курса
    addCourse: (state, action) => {
      if (!state.courses.some((course) => course._id === action.payload._id)) {
        state.courses.push(action.payload);
        // Инициализация прогресса для нового курса
        if (!state.progress[action.payload._id]) {
          state.progress[action.payload._id] = {
            completedWorkouts: [],
            totalProgress: 0,
          };
        }
      }
    },

    // Удаление курса
    removeCourse: (state, action) => {
      state.courses = state.courses.filter(
        (course) => course._id !== action.payload
      );
      // Удаление связанного прогресса
      delete state.progress[action.payload];
    },

    // Обновление прогресса по курсу
    updateCourseProgress: (state, action) => {
      const { courseId, workoutId } = action.payload;
      
      // Инициализация структуры прогресса
      if (!state.progress[courseId]) {
        state.progress[courseId] = {
          completedWorkouts: [],
          totalProgress: 0
        };
      }
      
      // Добавляем workoutId если его нет
      if (!state.progress[courseId].completedWorkouts.includes(workoutId)) {
        state.progress[courseId].completedWorkouts.push(workoutId);
      }
      
      // Пересчитываем общий прогресс
      const course = state.courses.find(c => c._id === courseId);
      if (course?.workouts) {
        const total = course.workouts.length;
        const completed = state.progress[courseId].completedWorkouts.length;
        state.progress[courseId].totalProgress = Math.round((completed / total) * 100);
      }
    },

    // Установка курсов и прогресса из Firebase
    setUserCourses: (state, action) => {
      state.courses = action.payload.courses || [];
      state.progress = action.payload.progress || {};
    },
  },
});

// Экспорт действий
export const {
  setUser,
  removeUser,
  setNewLogin,
  setNewPassword,
  addCourse,
  removeCourse,
  updateCourseProgress,
  setUserCourses,
} = userSlice.actions;

export default userSlice.reducer;
