import { createSlice } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";

const initialState = {
  chatState: {
    chatId: "",
    currentMessage: "",
    sentMessages: [],
    receivedMessages: [],
    status: "unactive",
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
    setCurrentMessage: (state, data) => {
      state.chatState.currentMessage = data.payload;
    },
    setSentMessages: (state, data) => {
      state.chatState.sentMessages = [
        ...state.chatState.sentMessages,
        data.payload,
      ];
    },
    setReceivedMessages: (state, data) => {
      state.chatState.receivedMessages = [
        ...state.chatState.receivedMessages,
        data.payload,
      ];
    },
    setChatStatus: (state, data) => {
      state.chatState.status = data.payload;
    }
  },
});

export const { setChatId, setCurrentMessage, setSentMessages, setReceivedMessages, setReceiptIds, setChatStatus } =
  chatSlice.actions;
export const selectChatId = (state) => state.chat.chatState.chatId;
export const selectCurrentMessage = (state) =>
  state.chat.chatState.currentMessage;
export const selectSentMessages = (state) =>
  state.chat.chatState.sentMessages;
  export const selectReceivedMessages = (state) =>
  state.chat.chatState.receivedMessages;
  export const selectChatStatus = (state) =>
  state.chat.chatState.status;

export default chatSlice.reducer;
