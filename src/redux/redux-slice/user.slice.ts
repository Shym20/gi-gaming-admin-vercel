import { createSlice } from "@reduxjs/toolkit";
import {
  getTokenLocal,
  getUserLocal,
  setTokenLocal,
  setUserLocal,
} from "../../utils/localStorage.utils";

const initialState = {
  giGamingAdmin_user_Info: getUserLocal(),
  giGamingAdmin_auth_token: getTokenLocal(),
  User: [],
};

//internally using immer lib (can create mutable state)
export const userSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    updateUser: (state, action) => {
      setUserLocal(action.payload);
      state.giGamingAdmin_user_Info = action.payload;
    },
    updateToken: (state, action) => {
      setTokenLocal(action.payload);
      state.giGamingAdmin_auth_token = action.payload;
    },
    updateAllUser: (state, action) => {
      state.User = action.payload;
    },
  },
});

// this is for dispatch
export const { updateUser, updateToken, updateAllUser } = userSlice.actions;

// this is for configureStore
export default userSlice.reducer;