import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import store from "./Auth/store";
import { Provider } from "react-redux";
import axios from "axios";

axios.interceptors.request.use(
  (config) => {
    const user = JSON.parse(window.localStorage.getItem("user")) || null;
    const token = user ? user.token : "";
    config.headers.authorization = token;
    //JSON.parse(window.localStorage.getItem("user")).token || null;
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
    //console.log("errorMy", error);

    /*     console.log("FRom intercetp", error);
    console.log(error.response.data);
    console.log("FRom intercetp",error.response.status);
    console.log(error.response.headers); */
    let description = "";
    if (error.message === "Network Error") {
      description = "Servidor dormido";
    }
    const customError = {
      data: {
        success: false,
        description:
          error?.response?.data?.description ||
          "Error en el servidor. " + description,
      },
    };
    return Promise.reject(customError);
  }
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
