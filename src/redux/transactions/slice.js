import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  fetchTransactions,
  deleteTransaction,
  addTransaction,
  editTransaction,
  copyTransaction,
  fetchTransactionCategories,
  fetchTransactionsSummary,
} from "../transactions/operations";
import { logoutThunk } from "../auth/operations";
const initialState = {
  transactions: [],
  categories: [],
  summary: null,
  isTransLoading: false,
  isTransError: null,
};
const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
        state.isTransLoading = false;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
        state.isTransLoading = false;
      })
      .addCase(editTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.map((transaction) =>
          transaction.id === action.payload.id
            ? action.payload
            : transaction
        );
        state.isTransLoading = false;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (transaction) => transaction.id !== action.payload
        );
        state.isTransLoading = false;
      })
      .addCase(copyTransaction.fulfilled, (state, action) => {
        state.transactions.push(action.payload);
        state.isTransLoading = false;
      })
      .addCase(fetchTransactionCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
        state.isTransLoading = false;
      })
      .addCase(fetchTransactionsSummary.fulfilled, (state, action) => {
        state.summary = action.payload;
        state.isTransLoading = false;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.transactions = [];
        state.categories = [];
        state.summary = null;
        state.isTransError = null;
      })
      .addMatcher(
        isAnyOf(
          fetchTransactions.pending,
          addTransaction.pending,
          deleteTransaction.pending,
          editTransaction.pending,
          copyTransaction.pending,
          fetchTransactionCategories.pending,
          fetchTransactionsSummary.pending
        ),
        (state) => {
          state.isTransLoading = true;
          state.isTransError = null;
        }
      )
      .addMatcher(
        isAnyOf(
          fetchTransactions.rejected,
          addTransaction.rejected,
          deleteTransaction.rejected,
          editTransaction.rejected,
          copyTransaction.rejected,
          fetchTransactionCategories.rejected,
          fetchTransactionsSummary.rejected
        ),
        (state, action) => {
          state.isTransError = action.payload;
          state.isTransLoading = false;
        }
      );
  },
});
export const transReducer = transactionsSlice.reducer;
