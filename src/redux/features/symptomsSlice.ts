import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Symptoms } from '@/types/symptoms';

interface symptomsInitialState {
    symptoms: Symptoms[];
    reduxLoading: boolean;
};

const initialState: symptomsInitialState = {
    symptoms: [],
    reduxLoading: false
};

export const symptomsSlice = createSlice({
    name: 'symptoms',
    initialState,
    reducers: {
        setSymptoms: (state, action: PayloadAction<Symptoms[]>) => {
            state.symptoms = action.payload;
            state.reduxLoading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.reduxLoading = action.payload;
        }
    },
});

export const { setSymptoms, setLoading } = symptomsSlice.actions;

// Export the reducer to be used in the store configuration
export default symptomsSlice.reducer;
