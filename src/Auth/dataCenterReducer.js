import { createSlice } from "@reduxjs/toolkit";

export const dataCenter = createSlice({
  name: "dataCenter",
  initialState: {
    products: { articles: [], books: [], reports: [] },
  },
  reducers: {
    pushArticles: (state, action) => {
     
      console.log("okey art");
    },
    pshlBooks: (state) => {
     
      console.log("okey book");
    },
    pushReports: (state, action) => {
     
      console.log("okey reports");
    },
    clean: (state, action) => {
      state.products = { articles: [], books: [], reports: [] };
    },
  },
});

export const { pushArticles, pushBooks, pushReports, clean } =
  dataCenter.actions;

export const selectDataCenter = (state) => state.dataCenter;

export default dataCenter.reducer;
