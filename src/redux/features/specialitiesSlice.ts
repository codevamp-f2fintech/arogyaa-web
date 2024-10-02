import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Specialities } from "../../types/specialities";

interface specialitiesInitialState {
  specialities: Specialities[];
  reduxLoading: boolean;
}

const initialState: specialitiesInitialState = {
  specialities: [],
  reduxLoading: false,
};

export const specialitiesSlice = createSlice({
  name: "specialities",
  initialState,
  reducers: {
    setSpecialities: (state, action: PayloadAction<Specialities[]>) => {
      state.specialities = action.payload;
      state.reduxLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.reduxLoading = action.payload;
    },
  },
});

export const { setSpecialities, setLoading } = specialitiesSlice.actions;

// Export the reducer to be used in the store configuration
export default specialitiesSlice.reducer;
