import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { doctorlist } from "@/types/doctorlist";


interface doctorlistInitialState {
  doctorlist: doctorlist[];
  reduxLoading: boolean;
}

const initialState: doctorlistInitialState = {
  doctorlist: [],
  reduxLoading: false,
};

export const doctorlistSlice = createSlice({
  name: "doctorlist",
  initialState,
  reducers: {
    setdoctorlist: (state, action: PayloadAction<doctorlist[]>) => {
      state.doctorlist = action.payload;
      state.reduxLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.reduxLoading = action.payload;
    },
  },
});

export const { setdoctorlist, setLoading } = doctorlistSlice.actions;

export default doctorlistSlice.reducer;
