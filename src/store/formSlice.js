import { createSlice, current } from '@reduxjs/toolkit';

const initialState = {
  createChatForm: {
    status: 'unfilled',
    idInstance: {
      value: '',
      status: 'unfilled',
    },
    apiTokenInstance: {
      value: '',
      status: 'unfilled',
    },
    tel: {
      value: '',
      status: 'unfilled',
    },
    error: '',
  },
};

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setValue: (state, data) => {
      const val = data.payload[0];
      const prop = data.payload[1];
      state.createChatForm[prop].value = val;
    },
    setFieldStatus: (state, data) => {
      const status = data.payload[0];
      const prop = data.payload[1];
      state.createChatForm[prop].status = status;
    },
    setFormStatus: (state, data) => {
      state.createChatForm.status = data.payload;
      console.log(current(state));
    },
    setError: (state, data) => {
      state.createChatForm.error = data.payload;
    },
    reset: () => initialState,
  },
});

export const {
  setValue,
  setFieldStatus,
  setRooms,
  setFormStatus,
  reset,
  setError,
} = formSlice.actions;
export const selectIdInstance = (state) => state.form.createChatForm.idInstance.value;
export const selectIdInstanceStatus = (state) => state.form.createChatForm.idInstance.status;
export const selectApiTokenInstance = (state) => state.form.createChatForm.apiTokenInstance.value;
export const selectApiTokenInsStatus = (state) => state.form.createChatForm.apiTokenInstance.status;
export const selectTel = (state) => state.form.createChatForm.tel.value;
export const selectTelStatus = (state) => state.form.createChatForm.tel.status;
export const selectFormStatus = (state) => state.form.createChatForm.status;
export const selectError = (state) => state.form.createChatForm.error;

export default formSlice.reducer;
