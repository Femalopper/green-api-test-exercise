import { createSlice, current } from '@reduxjs/toolkit';

const initialState = {
  chatState: {
    chatId: '',
    currentMessage: '',
    sentMessages: [],
    receivedMessages: [],
  },
};

export const chatSlice = createSlice({
  name: 'chat',
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
  },
});

export const {
  setChatId, setCurrentMessage, setSentMessages, setReceivedMessages, setReceiptIds,
} = chatSlice.actions;
export const selectChatId = (state) => state.chat.chatState.chatId;
export const selectCurrentMessage = (state) => state.chat.chatState.currentMessage;
export const selectSentMessages = (state) => state.chat.chatState.sentMessages;
export const selectReceivedMessages = (state) => state.chat.chatState.receivedMessages;

export default chatSlice.reducer;
