import { createSlice } from "@reduxjs/toolkit";

export const theme = createSlice({
  name: "myTheme",
  initialState: {
    theme: JSON.parse(window.localStorage.getItem('theme')) || "default",
  },
  reducers: {
    changetheme: (state, action) => {   
      if(!action.payload){
        window.localStorage.setItem('theme',JSON.stringify('default'));
      } else {
        window.localStorage.setItem('theme', JSON.stringify('dark'));
      }
    },
  },
});

export const { changetheme } =
  theme.actions;

export const selectTheme = (state) => state.myTheme;

export default theme.reducer;
