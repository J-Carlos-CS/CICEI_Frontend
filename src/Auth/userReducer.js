import { createSlice } from '@reduxjs/toolkit';

export const user = createSlice({
  name: 'user',
  initialState: {
    user: JSON.parse(window.localStorage.getItem('user')) || null,
    viewBar:window.localStorage.getItem('viewBar') || "collapse",
  },
  reducers: {
    login: (state, action) => {
      console.log("action.payload",action.payload)
      window.localStorage.setItem('user',JSON.stringify(action.payload));
      let user = JSON.parse(window.localStorage.getItem('user'));
      state.user = user ;
      window.localStorage.setItem('viewBar',"visible");
      let viewBar= window.localStorage.getItem("viewBar");
      state.viewBar= viewBar;
      console.log('okey login');
    },
    logout: (state) => {
        window.localStorage.removeItem('user');
        window.localStorage.removeItem('centerInformation');
        state.user=null;
        window.localStorage.setItem('viewBar',"collapse");
        state.viewBar="hidden";
        console.log('okey logout');
    },
    updateToken: (state,action)=>{
      let user = action.payload;
      state.user = user ;
      state.viewBar= "visible"
      console.log('okey refresh');
    }
    
  },
});

export const { login, logout, updateToken } = user.actions;

export const selectUser = state => state.user.user;
export const selectViewBar= state=> state.user.viewBar;

export default user.reducer;
