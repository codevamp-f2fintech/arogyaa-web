import { configureStore } from "@reduxjs/toolkit";

import notificationsReducer from "./features/notificationsSlice";
import snackbarReducer from "./features/snackbarSlice";
import specialitiesReducer from "./features/specialitySlice";
import symptomsReducer from "./features/symptomsSlice";
import userReducer from "./features/userSlice";
import testimonialReducer from "./features/testimonialSlice";
import doctorReducer from "./features/doctorSlice";
import chatReducer from "./features/chatSlice";
import patientReducer from "./features/patientSlice";

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    specialities: specialitiesReducer,
    snackbar: snackbarReducer,
    symptoms: symptomsReducer,
    user: userReducer,
    testimonial: testimonialReducer,
    doctors: doctorReducer,
    chatlist: chatReducer,
    patient: patientReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
