import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import {
  fetchTransactions,
  deleteTransaction,
  addTransaction,
  editTransaction,
  copyTransaction,
} from "../transactions/operations";
import { logoutThunk } from "../auth/operations";
const initialState = {
  transactions: [],
  isTransLoading: false,
  isTransError: null,
};
const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        // Assuming the thunk returns the transactions array directly from the API.
        state.transactions = action.payload;
        state.isTransLoading = false;
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        // The API returns an object with a 'transaction' key.
        state.transactions.push(action.payload.transaction);
        state.isTransLoading = false;
      })
      .addCase(editTransaction.fulfilled, (state, action) => {
        // The API returns the edited transaction object directly.
        state.transactions = state.transactions.map((transaction) =>
          transaction._id === action.payload._id
            ? action.payload
            : transaction
        );
        state.isTransLoading = false;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (transaction) => transaction._id !== action.payload
        );
        state.isTransLoading = false;
      })
      .addCase(copyTransaction.fulfilled, (state, action) => {
        // The API returns an object with a 'transaction' key.
        state.transactions.push(action.payload.transaction);
        state.isTransLoading = false;
      })
      .addCase(logoutThunk.fulfilled, (state) => {
        state.transactions = [];
        state.isTransError = null;
      })
      .addMatcher(
        isAnyOf(
          fetchTransactions.pending,
          addTransaction.pending,
          deleteTransaction.pending,
          editTransaction.pending,
          copyTransaction.pending
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
          copyTransaction.rejected
        ),
        (state, action) => {
          state.isTransError = action.payload;
          state.isTransLoading = false;
        }
      );
  },
});
export const transReducer = transactionsSlice.reducer;
