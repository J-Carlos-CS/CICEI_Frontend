import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userReducer';
import dataCenterReducer from './dataCenterReducer';
import themeReducer from './themeReducer';
import centerInformationReducer from './centerInformationReducer';

export default configureStore({
  reducer: {
    user: userReducer,
    dataCenter:dataCenterReducer,
    myTheme: themeReducer,
    centerInformation: centerInformationReducer,
  },
});
