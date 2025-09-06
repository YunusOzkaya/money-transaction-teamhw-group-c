import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

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

export const registerThunk = createAsyncThunk(
  "user/register",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await moneyGuardAPI.post("/api/auth/sign-up", credentials);
      setAuthHeader(data.token);
      toast.success("Registration successful! Welcome aboard.");
      return data;
    } catch (error) {
      if (error.response?.status === 409) {
        toast.error("User with the same email already exists.");
      } else {
        toast.error("Registration failed. Please try again.");
      }
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const loginThunk = createAsyncThunk(
  "user/login",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await moneyGuardAPI.post("/api/auth/sign-in", credentials);
      setAuthHeader(data.token);
      toast.success("Login successful! Welcome back.");
      return data;
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

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

export const refreshUserThunk = createAsyncThunk(
  "user/refresh",
  async (_, thunkAPI) => {
    const savedToken = thunkAPI.getState().auth.token;
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

export const getTotalBalanceThunk = createAsyncThunk(
  "balance/get",
  async (_, thunkAPI) => {
    try {
      const { data } = await moneyGuardAPI.get("/api/users/current");
      return data.balance;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


