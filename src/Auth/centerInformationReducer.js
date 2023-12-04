import { createSlice } from "@reduxjs/toolkit";

export const centerInformation = createSlice({
    name:"centerInformation",
    initialState:{
        centerInformation:JSON.parse(window.localStorage.getItem('centerInformation')) || null
    },
    reducers:{
        information: (state,action)=>{
            window.localStorage.setItem('centerInformation',JSON.stringify(action.payload));
            let centerInformation = JSON.parse(window.localStorage.getItem('centerInformation'));
            console.log("CenterInformationRedux",centerInformation)
            state.centerInformation = centerInformation ;
            console.log("centerInformation",state.centerInformation);
        }
    }
})

export const { information } = centerInformation.actions;

export const selectCenterInformation = state => state.centerInformation;

export default centerInformation.reducer;