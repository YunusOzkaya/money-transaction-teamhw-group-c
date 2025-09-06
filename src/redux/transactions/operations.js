import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { moneyGuardAPI, getTotalBalanceThunk } from "../auth/operations";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_, thunkAPI) => {
    try {
      const { data } = await moneyGuardAPI.get("/api/transactions");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addTransaction = createAsyncThunk(
  "transactions/addTransaction",
  async (body, thunkAPI) => {
    try {
      const { data } = await moneyGuardAPI.post("/api/transactions", body);
      thunkAPI.dispatch(getTotalBalanceThunk());
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const editTransaction = createAsyncThunk(
  "transactions/editTransaction",
  async ({ id, transaction }, thunkAPI) => {
    try {
      const { date, type, category, comment, sum } = transaction;
      const { data } = await moneyGuardAPI.patch(`/api/transactions/${id}`, {
        transactionDate: date,
        type,
        categoryId: category,
        comment,
        amount: sum,
      });
      thunkAPI.dispatch(getTotalBalanceThunk());
      
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteTransaction = createAsyncThunk(
  "transactions/deleteTransaction",
  async (id, thunkAPI) => {
    try {
      await moneyGuardAPI.delete(`/api/transactions/${id}`);
      thunkAPI.dispatch(getTotalBalanceThunk());
      toast.success("Transaction deleted successfully!");
      return id;
    } catch (error) {
      toast.error(`Failed to delete transaction: ${error.message}`);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const copyTransaction = createAsyncThunk(
  "transactions/copyTransaction",
  async (id, thunkAPI) => {
    try {
      const { data: originalTransaction } = await moneyGuardAPI.get(
        `/api/transactions/${id}`
      );
      const original = originalTransaction;
      const transactionCopy = {
        transactionDate: original.transactionDate,
        type: original.type,
        categoryId: original.categoryId,
        comment: original.comment,
        amount: original.amount,
      };
      const { data } = await moneyGuardAPI.post(
        "/api/transactions",
        transactionCopy
      );
			thunkAPI.dispatch(getTotalBalanceThunk());
			toast.success("Transaction successfully repeated!");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchTransactionCategories = createAsyncThunk(
  "transactions/fetchCategories",
  async (_, thunkAPI) => {
    try {
      const { data } = await moneyGuardAPI.get("/api/transaction-categories");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchTransactionsSummary = createAsyncThunk(
  "transactions/fetchSummary",
  async (period, thunkAPI) => {
    try {
      const { data } = await moneyGuardAPI.get("/api/transactions-summary", {
        params: period
      });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);
