import { configureStore } from "@reduxjs/toolkit";

import notificationsReducer from './features/notificationsSlice';
import snackbarReducer from "./features/snackbarSlice";
import specialitiesReducer from "./features/specialitiesSlice";
import symptomsReducer from './features/symptomsSlice';
import userReducer from "./features/userSlice";

export const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    specialities: specialitiesReducer,
    snackbar: snackbarReducer,
    symptoms: symptomsReducer,
    user: userReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
