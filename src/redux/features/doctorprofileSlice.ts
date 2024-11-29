import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { doctorprofile } from "@/types/doctorprofile";


interface doctorprofileInitialState {
  doctorprofile: doctorprofile[];
  reduxLoading: boolean;
}

const initialState: doctorprofileInitialState = {
  doctorprofile: [],
  reduxLoading: false,
};

export const doctorprofileSlice = createSlice({
  name: "doctorprofile",
  initialState,
  reducers: {
    setdoctorprofile: (state, action: PayloadAction<doctorprofile[]>) => {
      state.doctorprofile = action.payload;
      state.reduxLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.reduxLoading = action.payload;
    },
  },
});

export const { setdoctorprofile, setLoading } = doctorprofileSlice.actions;

export default doctorprofileSlice.reducer;
