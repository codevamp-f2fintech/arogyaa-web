import { configureStore } from "@reduxjs/toolkit";

import notificationsReducer from "./features/notificationsSlice";
import snackbarReducer from "./features/snackbarSlice";
import specialitiesReducer from "./features/specialitiesSlice";
import symptomsReducer from "./features/symptomsSlice";
import userReducer from "./features/userSlice";
import testimonialReducer from "./features/testimonialSlice";
import doctorprofileReducer  from './features/doctorprofileSlice';

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    specialities: specialitiesReducer,
    snackbar: snackbarReducer,
    symptoms: symptomsReducer,
    user: userReducer,
    testimonial: testimonialReducer,
    doctorprofile: doctorprofileReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
