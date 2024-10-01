import { configureStore } from "@reduxjs/toolkit";

import snackbarReducer from "./features/snackbarSlice";
import specialitiesReducer from "./features/specialitiesSlice";
import userReducer from "./features/userSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    specialities: specialitiesReducer,
    snackbar: snackbarReducer,
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
