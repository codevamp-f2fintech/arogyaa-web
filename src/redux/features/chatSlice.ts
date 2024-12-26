import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ChatData } from "@/types/chat";

interface chatdataInitialState {
  chatdata: ChatData[];
  reduxLoading: boolean;
}

const initialState: chatdataInitialState = {
  chatdata: [],
  reduxLoading: false,
};

export const chatdataSlice = createSlice({
  name: "chatdata",
  initialState,
  reducers: {
    setchatdata: (state, action: PayloadAction<ChatData[]>) => {
      state.chatdata = action.payload;
      state.reduxLoading = false;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.reduxLoading = action.payload;
    },
  },
});

export const { setchatdata, setLoading } = chatdataSlice.actions;

export default chatdataSlice.reducer;
