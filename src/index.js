import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";
import store from "./Auth/store.js";
import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(window.localStorage.getItem("user")) || null;
    const token = user ? user.token : "";
    config.headers.Authorization = token;
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

axios.interceptors.response.use(
  function (response) {
    //console.log("responseMy", response);
    if (response.data?.description === "No autorizado") {
      window.localStorage.removeItem("user");
      window.location.reload();
    }
    return response;
  },
  function (error) {
    let description = "";
    if (error.message === "Network Error") {
      description = "Servidor dormido";
    }
    const customError = {
      data: {
        success: false,
        description: error?.response?.data?.description || "Error en el servidor. " + description,
      },
    };
    return Promise.reject(customError);
  }
);

setupListeners(store.dispatch);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
