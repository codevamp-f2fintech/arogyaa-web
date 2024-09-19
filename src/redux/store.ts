import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/userSlice";
import specialitiesReducer from "./features/specialitiesSlice";

// Configure the store to include user and specialities reducers with thunk middleware
export const store = configureStore({
  reducer: {
    user: userReducer, // Include user slice
    specialities: specialitiesReducer, // Include specialities slice
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
