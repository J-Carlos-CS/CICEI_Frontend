import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userReducer";
import globalReducer from "state";
import { api } from "state/api";

export default configureStore({
  reducer: {
    user: userReducer,
    global: globalReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefault) => getDefault().concat(api.middleware),
});
