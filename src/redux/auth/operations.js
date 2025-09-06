import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const API_PREFIX = "/api"; // sunucunda prefix yoksa "" yap

export const moneyGuardAPI = axios.create({
  baseURL: "https://server-money-guard-teamproject.onrender.com", // sondaki / kaldırıldı
  withCredentials: false
});

export const setAuthHeader = (token) => {
  moneyGuardAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
};
export const resetAuthHeader = () => {
  delete moneyGuardAPI.defaults.headers.common.Authorization;
};

export const registerThunk = createAsyncThunk(
  "user/register",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await moneyGuardAPI.post(`${API_PREFIX}/auth/register`, credentials);
      setAuthHeader(data.data.accessToken);
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
      const { data } = await moneyGuardAPI.post(`${API_PREFIX}/auth/login`, credentials);
      setAuthHeader(data.data.accessToken);
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
      const lastPath = state.router?.location?.pathname || window.location.pathname;
      localStorage.setItem("lastVisitedPage", lastPath);
      await moneyGuardAPI.post(`${API_PREFIX}/auth/logout`);
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
    if (!savedToken) return thunkAPI.rejectWithValue("Token is not exist");
    setAuthHeader(savedToken);
    try {
      const { data } = await moneyGuardAPI.get(`${API_PREFIX}/users/current`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const editUserName = createAsyncThunk(
  "users/editName",
  async ({ name }, thunkAPI) => {
    try {
      const { data } = await moneyGuardAPI.patch(`${API_PREFIX}/users/current`, { name });
      await thunkAPI.dispatch(refreshUserThunk());
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const editUserAvatar = createAsyncThunk(
  "users/editAvatar",
  async ({ avatar }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("avatar", avatar);
      const { data } = await moneyGuardAPI.patch(
        `${API_PREFIX}/users/current/avatar`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      await thunkAPI.dispatch(refreshUserThunk());
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
      const { data } = await moneyGuardAPI.get(`${API_PREFIX}/users/current`);
      return data.data.balance;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "users/resetPassword",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await moneyGuardAPI.post(`${API_PREFIX}/auth/send-reset-email`, credentials);
      toast.success("Reset Email password was sent successfully");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const changePassword = createAsyncThunk(
  "users/changePassword",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await moneyGuardAPI.post(`${API_PREFIX}/auth/reset-pwd`, credentials);
      toast.success("Password was changed successfully");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
