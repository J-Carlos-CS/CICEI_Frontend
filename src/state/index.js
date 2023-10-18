import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  mode: "dark",
  userId: 3, // Inicializado como nulo, ya que el valor será proporcionado dinámicamente.
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    }
   
  },
});

export const { setMode} = globalSlice.actions;

export default globalSlice.reducer;