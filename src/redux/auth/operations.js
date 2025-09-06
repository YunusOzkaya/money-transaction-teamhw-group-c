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
      const token = data.token;
      setAuthHeader(token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      toast.success("Kayıt başarılı!");
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Kayıt başarısız oldu.");
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
      const token = data.token;
      setAuthHeader(token);
      localStorage.setItem("authUser", JSON.stringify(data.user));
      toast.success("Giriş başarılı!");
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Giriş başarısız oldu.");
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// LOGOUT
export const logoutThunk = createAsyncThunk("auth/logout", async (_, thunkAPI) => {
  try {
    await moneyGuardAPI.delete("/auth/sign-out");
    resetAuthHeader();
    toast.success("Çıkış yapıldı.");
  } catch (error) {
    toast.error("Çıkış başarısız oldu.");
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
