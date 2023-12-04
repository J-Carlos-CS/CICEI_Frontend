import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

export const login = async (action) => {
  var token = jwtDecode(action);
  localStorage.setItem("user", JSON.stringify(token));
  localStorage.setItem("token", JSON.stringify(action));
};

export const selectUser = () => {
  var user = JSON.parse(localStorage.getItem("user"));
  return user;
};
export const logout = () => {
  localStorage.removeItem("user");
  localStorage.clear();
  return true;
};
export const user = createSlice({
  name: "user",
  initialState: {
    user: JSON.parse(window.localStorage.getItem("user")) || null,
    viewBar: window.localStorage.getItem("viewBar") || "collapse",
  },
  reducers: {
    login: (action) => {
      localStorage.setItem("user", JSON.stringify(action));
      console.log("okey login");
    },
    logout: (state) => {
      window.localStorage.removeItem("user");
      window.localStorage.removeItem("centerInformation");
      state.user = null;
      window.localStorage.setItem("viewBar", "collapse");
      state.viewBar = "hidden";
      console.log("okey logout");
    },
    updateToken: (state, action) => {
      let user = action.payload;
      state.user = user;
      state.viewBar = "visible";
      console.log("okey refresh");
    },
  },
});

export const { updateToken } = user.actions;

export const selectViewBar = (state) => state.user.viewBar;

export default user.reducer;
