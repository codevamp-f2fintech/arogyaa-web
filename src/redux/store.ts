import { configureStore } from "@reduxjs/toolkit";

import notificationsReducer from "./features/notificationsSlice";
import snackbarReducer from "./features/snackbarSlice";
import specialitiesReducer from "./features/specialitiesSlice";
import symptomsReducer from "./features/symptomsSlice";
import userReducer from "./features/userSlice";
import testimonialReducer from "./features/testimonialSlice";
import doctorprofileReducer from './features/doctorprofileSlice';
import doctorReducer from './features/doctorSlice';
import expert_specialist_doctorReducer from './features/expert_specialist_doctorSlice';

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    specialities: specialitiesReducer,
    snackbar: snackbarReducer,
    symptoms: symptomsReducer,
    user: userReducer,
    testimonial: testimonialReducer,
    doctorprofile: doctorprofileReducer,
    doctors: doctorReducer,
    expert_specialist_doctor: expert_specialist_doctorReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
