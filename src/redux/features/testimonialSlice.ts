import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Testimonial } from "@/types/testimonial";

interface testimonialInitialState {
  testimonial: Testimonial[];
  reduxLoading: boolean;
}

const initialState: testimonialInitialState = {
  testimonial: [],
  reduxLoading: false,
};

export const testimonialSlice = createSlice({
  name: "testimonial",
  initialState,
  reducers: {
    setTestimonial: (state, action: PayloadAction<Testimonial[]>) => {
      state.testimonial = action.payload;
      state.reduxLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.reduxLoading = action.payload;
    },
  },
});

export const { setTestimonial, setLoading } = testimonialSlice.actions;

export default testimonialSlice.reducer;
