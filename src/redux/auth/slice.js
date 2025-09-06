import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  loginThunk,
  logoutThunk,
  refreshUserThunk,
  registerThunk,
  getTotalBalanceThunk,
} from "./operations";

const initialState = {
  user: {
    id: null,
    username: null,
    email: null,
    balance: null,
  },
  token: null,
  isLoggedIn: false,
  isRefreshing: false,
  isAuthLoading: false,
  isAuthError: null,
  isRegistering: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateBalance: (state, action) => {
      state.user.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutThunk.fulfilled, () => {
        return { ...initialState };
      })
      .addCase(getTotalBalanceThunk.fulfilled, (state, action) => {
        state.user.balance = action.payload;
      })
      .addCase(refreshUserThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoggedIn = true;
        state.isRefreshing = false;
        state.isAuthLoading = false;
      })
      .addCase(refreshUserThunk.pending, (state) => {
        state.isRefreshing = true;
        state.isAuthLoading = true;
        state.isLoggedIn = true;
      })
      .addCase(refreshUserThunk.rejected, (state) => {
        state.isRefreshing = false;
        state.isAuthLoading = false;
        state.isLoggedIn = false;
      })
      .addMatcher(
        isAnyOf(registerThunk.fulfilled, loginThunk.fulfilled),
        (state, action) => {
          state.user.id = action.payload.user.id;
          state.user.username = action.payload.user.username;
          state.user.email = action.payload.user.email;
          state.user.balance = action.payload.user.balance;
          state.token = action.payload.token;
          state.isLoggedIn = true;
          state.isRegistering = false;
        }
      )
      .addMatcher(
        isAnyOf(registerThunk.pending, loginThunk.pending),
        (state) => {
          state.isAuthLoading = true;
          state.isAuthError = null;
          state.isRegistering = true;
        }
      )
      .addMatcher(
        isAnyOf(registerThunk.rejected, loginThunk.rejected),
        (state, action) => {
          state.isAuthLoading = false;
          state.isAuthError = action.payload;
          state.isRegistering = false;
        }
      );
  },
});

export const authReducer = authSlice.reducer;
export const { updateBalance } = authSlice.actions;
