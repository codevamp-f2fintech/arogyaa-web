import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { Notifications } from '@/types/notifications';

interface NotificationsState {
  notifications: Notifications[];
  reduxLoading: boolean;
}

const initialState: NotificationsState = {
  notifications: [],
  reduxLoading: false,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Replace all notifications
    setNotifications: (state, action: PayloadAction<Notifications[]>) => {
      state.notifications = action.payload;
      state.reduxLoading = false;
    },

    // Add one notification to the top
    addNotification: (state, action: PayloadAction<Notifications>) => {
      state.notifications.unshift(action.payload);
    },

    // Set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.reduxLoading = action.payload;
    },
  },
});

// ✅ Export actions
export const { setNotifications, addNotification, setLoading } = notificationsSlice.actions;

// ✅ Export selectors
export const selectNotifications = (state: RootState) => state.notifications.notifications;

export const selectUnreadCount = (state: RootState) =>
  state.notifications.notifications.filter((n) => n.status === 'unread').length;

export const selectReadCount = (state: RootState) =>
  state.notifications.notifications.filter((n) => n.status === 'read').length;

// ✅ Export reducer
export default notificationsSlice.reducer;
