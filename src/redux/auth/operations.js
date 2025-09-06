import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// The base URL has been updated to the new API endpoint
export const moneyGuardAPI = axios.create({
  baseURL: "https://wallet.b.goit.study/",
  withCredentials: true,
});

export const setAuthHeader = (token) => {
  moneyGuardAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
};
export const resetAuthHeader = () => {
  moneyGuardAPI.defaults.headers.common.Authorization = ``;
};

// This thunk now uses the real API endpoint for registration
export const registerThunk = createAsyncThunk(
  "user/register",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await moneyGuardAPI.post("/api/auth/sign-up", credentials);
        setAuthHeader(data.data.accessToken);
      toast.success("Registration successful! Welcome aboard.");
      
      return data;
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// This thunk now uses the real API endpoint for login
export const loginThunk = createAsyncThunk(
  "user/login",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await moneyGuardAPI.post("/api/auth/sign-in", credentials);
        setAuthHeader(data.data.accessToken);
      toast.success("Login successful! Welcome back.");
      
      return data;
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// This thunk now uses the real API endpoint for logout
export const logoutThunk = createAsyncThunk(
  "user/logout",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const lastPath =
        state.router?.location?.pathname || window.location.pathname;
      localStorage.setItem("lastVisitedPage", lastPath);
      await moneyGuardAPI.delete("/api/auth/sign-out");
      resetAuthHeader();
      toast.success("Logout successful! We'll be waiting for you!");
    } catch (error) {
      toast.error("Logout failed. Try again. You are still with us!");
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// This thunk now uses the updated base URL
export const refreshUserThunk = createAsyncThunk(
  "user/refresh",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const savedToken = state.auth.token; // Changed to get token from state
    if (!savedToken) {
      return thunkAPI.rejectWithValue("Token is not exist");
      }
    setAuthHeader(savedToken);
    try {
      const { data } = await moneyGuardAPI.get("/api/users/current");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// This thunk now uses the updated base URL
export const editUserName = createAsyncThunk(
  "users/editName",
  async ({ name }, thunkAPI) => {
    try {
      const { data } = await moneyGuardAPI.patch(`/api/users/current`, { name });
      refreshUserThunk();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// This thunk now uses the updated base URL
export const editUserAvatar = createAsyncThunk(
  "users/editAvatar",
  async ({ avatar }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("avatar", avatar);

      const { data } = await moneyGuardAPI.patch(
        "/api/users/current/avatar",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      refreshUserThunk();
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// This thunk now uses the updated base URL
export const getTotalBalanceThunk = createAsyncThunk(
  "balance/get",
  async (_, thunkAPI) => {
    try {
      const { data } = await moneyGuardAPI.get("/api/users/current");
      return data.data.balance;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// This thunk now uses the updated base URL
export const resetPassword = createAsyncThunk(
  "users/resetPassword",
  async (credentials, thunkAPI) => {
    try {
      const data = await moneyGuardAPI.post(`/api/auth/send-reset-email`, credentials);
      toast.success("Reset Email password was sent successfully");
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// This thunk now uses the updated base URL
export const changePassword = createAsyncThunk(
  "users/changePassword",
  async(credentials, thunkAPI) => {
    try {
      const data = await moneyGuardAPI.post('/api/auth/reset-pwd', credentials);
      toast.success("Password was changed successfully");
      return data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
)
