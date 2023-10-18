import { configureStore } from '@reduxjs/toolkit';
import userReducer, { user } from './userReducer';
import globalReducer from "state"
import { Provider } from 'react-redux';
import {setupListeners} from "@reduxjs/toolkit/query"
export default configureStore({
    reducer: {
      user: userReducer,
    },

    
  });
  
