import { createSlice } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";

const initialState = {
  chatState: {
    chatId: "",
  },
};

export const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChatId: (state, data) => {
      state.chatState.chatId = data.payload;
      console.log(current(state));
    },
  },
});

export const { setChatId } =
  chatSlice.actions;
export const selectChatId = (state) =>
  state.chat.chatState.chatId;

export default chatSlice.reducer;
