// src/redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/auth.slice';
import contactReducer from './slices/contactSlice';
import courseReducer from './slices/course.slice';
import statsReducer from "./slices/statsSlice"
import razorpayReducer from "./slices/razorpay.slice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    contact: contactReducer,
    courses: courseReducer,
    stats: statsReducer,
    razorpay: razorpayReducer
  },
});

export default store;
