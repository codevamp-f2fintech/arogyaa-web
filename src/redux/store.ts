import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import snackbarReducer from "./features/snackbarSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    snackbar: snackbarReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
