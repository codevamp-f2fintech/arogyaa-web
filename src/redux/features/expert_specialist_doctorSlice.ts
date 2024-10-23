import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { expert_specialist_doctor } from "@/types/expert_specialist_doctor";


interface expert_specialist_doctorInitialState {
  expert_specialist_doctor: expert_specialist_doctor[];
  reduxLoading: boolean;
}

const initialState: expert_specialist_doctorInitialState = {
  expert_specialist_doctor: [],
  reduxLoading: false,
};

export const expert_specialist_doctorSlice = createSlice({
  name: "expert_specialist_doctor",
  initialState,
  reducers: {
    setexpert_specialist_doctor: (state, action: PayloadAction<expert_specialist_doctor[]>) => {
      state.expert_specialist_doctor = action.payload;
      state.reduxLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.reduxLoading = action.payload;
    },
  },
});

export const { setexpert_specialist_doctor, setLoading } = expert_specialist_doctorSlice.actions;

export default expert_specialist_doctorSlice.reducer;
