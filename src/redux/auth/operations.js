import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export const moneyGuardAPI = axios.create({
  baseURL: "https://wallet.b.goit.study/api",
  withCredentials: false,
});

export const setAuthHeader = (token) => {
  moneyGuardAPI.defaults.headers.common.Authorization = `Bearer ${token}`;
  localStorage.setItem("authToken", token);
};

export const resetAuthHeader = () => {
  delete moneyGuardAPI.defaults.headers.common.Authorization;
  localStorage.removeItem("authToken");
  localStorage.removeItem("authUser");
};

// REGISTER
export const registerThunk = createAsyncThunk(
  "auth/register",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await moneyGuardAPI.post("/auth/sign-up", credentials);
      const token = data.accessToken;
      setAuthHeader(token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      toast.success("Registration successful!");
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// LOGIN
export const loginThunk = createAsyncThunk(
  "auth/login",
  async (credentials, thunkAPI) => {
    try {
      const { data } = await moneyGuardAPI.post("/auth/sign-in", credentials);
      const token = data.accessToken;
      setAuthHeader(token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      toast.success("Login successful!");
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// LOGOUT
export const logoutThunk = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await moneyGuardAPI.post("/auth/logout");
    resetAuthHeader();
    toast.success("Logged out");
  } catch (error) {
    toast.error("Logout failed");
    return thunkAPI.rejectWithValue(error.message);
  }
});

// REFRESH (localStorage’dan oku)
export const refreshUserThunk = createAsyncThunk(
  "auth/refresh",
  async (_, thunkAPI) => {
    const token = localStorage.getItem("authToken");
    const user = localStorage.getItem("authUser");
    if (!token || !user) return thunkAPI.rejectWithValue("No saved auth");
    setAuthHeader(token);
    try {
      const parsedUser = JSON.parse(user);
      return { accessToken: token, user: parsedUser };
    } catch (e) {
      return thunkAPI.rejectWithValue("Invalid local data");
    }
  }
);
