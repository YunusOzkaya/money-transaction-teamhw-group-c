export const selectTransactions = (state) => state.transactions.transactions;
export const selectCategories = (state) => state.transactions.categories;
export const selectSummary = (state) => state.transactions.summary;
export const isTransLoading = (state) => state.transactions.isTransLoading;
export const isTransError = (state) => state.transactions.isTransError;
