import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../lib/axios";


const API_ENDPOINT = `/statement-rule`;

// Thunk to fetch employer from the API
export const fetchStatementRules = createAsyncThunk(
  "statementRule/fetchStatementRules",
  async () => {
    const response = await apiClient.get(API_ENDPOINT);

    return response.data.statementRules;
  }
);

// employer slice
const statementRuleReducer = createSlice({
  name: "statementRule",
  initialState: {
    statementRules: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatementRules.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchStatementRules.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.statementRules = action.payload;
      })
      .addCase(fetchStatementRules.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default statementRuleReducer.reducer;
