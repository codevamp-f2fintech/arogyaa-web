import { configureStore } from '@reduxjs/toolkit';

import userReducer from './features/userSlice';
import  symptomsReducer  from './features/symptomsSlice';
import notificationsReducer from './features/notificationsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    symptoms:symptomsReducer,
    notifications:notificationsReducer
  },
});

export default store;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
