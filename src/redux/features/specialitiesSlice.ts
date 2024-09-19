import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Specialities } from "@/types/specialities";

interface SpecialitiesInitialState {
  specialities: Specialities[];
  reduxLoading: boolean;
  error: string | null;
}

const initialState: SpecialitiesInitialState = {
  specialities: [],
  reduxLoading: false,
  error: null,
};

// Async thunk to fetch specialities from API
export const fetchSpecialities = createAsyncThunk(
  "specialities/fetchSpecialities",
  async (_, { rejectWithValue }) => {
    try {
      // Use the API URL from the .env file
      const apiUrl = process.env.NEXT_PUBLIC_APP_URL;
      const response = await axios.get(
        `${apiUrl}/speciality/get-specializations`
      );
      return response.data; // Assuming the API returns the array of specialities
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const specialitiesSlice = createSlice({
  name: "specialities",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.reduxLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecialities.pending, (state) => {
        state.reduxLoading = true;
        state.error = null;
      })
      .addCase(
        fetchSpecialities.fulfilled,
        (state, action: PayloadAction<Specialities[]>) => {
          state.specialities = action.payload;
          state.reduxLoading = false;
        }
      )
      .addCase(
        fetchSpecialities.rejected,
        (state, action: PayloadAction<any>) => {
          state.reduxLoading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { setLoading } = specialitiesSlice.actions;

// Export the reducer to be used in the store configuration
export default specialitiesSlice.reducer;
