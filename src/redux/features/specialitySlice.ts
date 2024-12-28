import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Speciality } from "@/types/speciality";

interface SpecialityInitialState {
  speciality: Speciality | null;
  reduxLoading: boolean;
}

const initialState: SpecialityInitialState = {
  speciality: null,
  reduxLoading: false,
};

export const SpecialitySlice = createSlice({
  name: "speciality",
  initialState,
  reducers: {
    setSpeciality: (state, action: PayloadAction<Speciality>) => {
      state.speciality = action.payload;
      state.reduxLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.reduxLoading = action.payload;
    },
  },
});

export const { setSpeciality, setLoading } = SpecialitySlice.actions;
export default SpecialitySlice.reducer;
