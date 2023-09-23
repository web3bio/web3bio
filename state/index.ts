import { configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import universal from "./universal/reducer";
import widgets from './widgets/reducer'

const store = configureStore({
  devTools: process.env.NODE_ENV !== "production",
  reducer: {
    universal,
    widgets
  },
  middleware: [...getDefaultMiddleware({ thunk: true })],
});

// store.dispatch(updateVersion());

export type AppDispatch = typeof store.dispatch;
export type AppState = ReturnType<typeof store.getState>;
export const useAppDispatch = () => useDispatch();

export default store;
