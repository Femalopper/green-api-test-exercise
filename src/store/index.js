import { configureStore } from '@reduxjs/toolkit';
import formReducer from './formSlice';
import chatReducer from './chatSlice';

export default configureStore({
  reducer: {
    form: formReducer,
    chat: chatReducer,
  },
});
