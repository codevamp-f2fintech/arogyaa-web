import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Snackbar } from "@/types/snackbar";

interface SnackbarState {
  snackbar: Snackbar;
}

const initialState: SnackbarState = {
  snackbar: { snackbarAlert: false, snackbarSeverity: "info", snackbarMessage: "" },
};

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    setSnackbar: (state, action: PayloadAction<Snackbar>) => {
      state.snackbar = action.payload;
    }
  }
});

export const { setSnackbar } = snackbarSlice.actions;
export default snackbarSlice.reducer;
