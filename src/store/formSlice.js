import { createSlice } from "@reduxjs/toolkit";
import { current } from "@reduxjs/toolkit";

const initialState = {
  createChatForm: {
    status: "unfilled",
    idInstance: {
      value: "",
      status: "unfilled",
    },
    apiTokenInstance: {
      value: "",
      status: "unfilled",
    },
    tel: {
      value: "",
      status: "unfilled",
    },
  },
};

export const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    setValue: (state, data) => {
      const val = data.payload[0];
      const prop = data.payload[1];
      state.createChatForm[prop].value = val;
      console.log(current(state));
    },
    setFieldStatus: (state, data) => {
      const status = data.payload[0];
      const prop = data.payload[1];
      state.createChatForm[prop].status = status;
    },
    setFormStatus: (state, data) => {
      state.createChatForm.status = data.payload;
    },
    reset: () => initialState,
  },
});

export const { setValue, setFieldStatus, setRooms, setFormStatus, reset } =
  formSlice.actions;
export const selectIdInstance = (state) =>
  state.form.createChatForm.idInstance.value;
export const selectApiTokenInstance = (state) =>
  state.form.createChatForm.apiTokenInstance.value;
export const selectTel = (state) => state.form.createChatForm.tel.value;


export default formSlice.reducer;
