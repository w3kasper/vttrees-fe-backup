import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  isLoggedIn: boolean;
  isAdmin: boolean;
  username: string;
  userId: number;
}

const initialState: AuthState = {
  isLoggedIn: false,
  isAdmin: false,
  username: "",
  userId: 0,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        isAdmin: boolean;
        username: string;
        userId: number;
      }>
    ) => {
      state.isLoggedIn = true;
      state.isAdmin = action.payload.isAdmin;
      state.username = action.payload.username;
      state.userId = action.payload.userId;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.isAdmin = false;
      state.username = "";
      state.userId = 0;
    },
  },
});

export const { login, logout } = authSlice.actions;

export default authSlice.reducer;
