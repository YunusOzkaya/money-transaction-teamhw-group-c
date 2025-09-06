import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

const API = axios.create({ baseURL: "https://wallet.b.goit.study/api" });

export const setAuthHeader = (token) => {
  API.defaults.headers.common.Authorization = `Bearer ${token}`;
};
export const resetAuthHeader = () => {
  delete API.defaults.headers.common.Authorization;
};

export const registerThunk = createAsyncThunk("auth/register", async (body, { rejectWithValue }) => {
  try {
    const { data } = await API.post("/auth/sign-up", body);
    setAuthHeader(data.accessToken);
    toast.success("Registered");
    return data;
  } catch (e) {
    toast.error(e.response?.data?.message || "Register failed");
    return rejectWithValue(e.message);
  }
});

export const loginThunk = createAsyncThunk("auth/login", async (body, { rejectWithValue }) => {
  try {
    const { data } = await API.post("/auth/sign-in", body);
    setAuthHeader(data.accessToken);
    toast.success("Logged in");
    return data;
  } catch (e) {
    toast.error(e.response?.data?.message || "Login failed");
    return rejectWithValue(e.message);
  }
});

export const logoutThunk = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    await API.post("/auth/logout");
    resetAuthHeader();
    toast.success("Logged out");
  } catch (e) {
    toast.error("Logout failed");
    return rejectWithValue(e.message);
  }
});

export const refreshUserThunk = createAsyncThunk("auth/refresh", async (_, { getState, rejectWithValue }) => {
  const token = getState().auth.token;
  if (!token) return rejectWithValue("No token");
  setAuthHeader(token);
  try {
    const { data } = await API.get("/users/current");
    return data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const editUserName = createAsyncThunk("users/editName", async ({ name }, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await API.patch("/users/current", { name });
    await dispatch(refreshUserThunk());
    return data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const editUserAvatar = createAsyncThunk("users/editAvatar", async ({ avatar }, { dispatch, rejectWithValue }) => {
  try {
    const fd = new FormData();
    fd.append("avatar", avatar);
    const { data } = await API.patch("/users/current/avatar", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    await dispatch(refreshUserThunk());
    return data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const getTotalBalanceThunk = createAsyncThunk("balance/get", async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get("/users/current");
    return data.balance;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const resetPassword = createAsyncThunk("auth/resetEmail", async (body, { rejectWithValue }) => {
  try {
    const { data } = await API.post("/auth/send-reset-email", body);
    toast.success("Reset email sent");
    return data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const changePassword = createAsyncThunk("auth/changePassword", async (body, { rejectWithValue }) => {
  try {
    const { data } = await API.post("/auth/reset-pwd", body);
    toast.success("Password changed");
    return data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const getCategoriesThunk = createAsyncThunk("categories/get", async (_, { rejectWithValue }) => {
  try {
    const { data } = await API.get("/transactions/categories");
    return data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});

export const addTransactionThunk = createAsyncThunk("transactions/add", async (tx, { rejectWithValue }) => {
  try {
    const { data } = await API.post("/transactions", tx);
    toast.success("Transaction added");
    return data;
  } catch (e) {
    toast.error("Add failed");
    return rejectWithValue(e.message);
  }
});

export const deleteTransactionThunk = createAsyncThunk("transactions/delete", async (id, { rejectWithValue }) => {
  try {
    const { data } = await API.delete(`/transactions/${id}`);
    toast.success("Transaction deleted");
    return data;
  } catch (e) {
    toast.error("Delete failed");
    return rejectWithValue(e.message);
  }
});

export const getStatisticsThunk = createAsyncThunk("transactions/stats", async ({ month, year }, { rejectWithValue }) => {
  try {
    const { data } = await API.get("/transactions/statistics", { params: { month, year } });
    return data;
  } catch (e) {
    return rejectWithValue(e.message);
  }
});
