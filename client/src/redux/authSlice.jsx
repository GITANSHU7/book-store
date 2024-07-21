import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: JSON.parse(localStorage.getItem("userData")) || null,
  },
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("userData", JSON.stringify(action.payload)); 
    },
    clearUserData: (state) => {
      state.user = null;
      localStorage.removeItem("userData"); 
    },
  },
});

export const { setUserData, clearUserData } = authSlice.actions;
export default authSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// export const authSlice = createSlice({
//   name: "auth",
//   initialState: {
//     user: null,
//   },
//   reducers: {
//     setUserData: (state, action) => {
//       state.user = action.payload;
//     },
//   },
// });

// export const { setUserData } = authSlice.actions;
// export default authSlice.reducer;

// import { createSlice } from "@reduxjs/toolkit";

// export const authSlice = createSlice({
//     name: "auth",
//     initialState: {
//         user: null,
//         // authenticated: false,
//     },
//     reducers: {

//         // save user data to redux store
//         setUserData: (state, action) => {
//         state.user = action.payload;


       
//         },
       
//     },
//     });

//     export const { setUserData } = authSlice.actions;