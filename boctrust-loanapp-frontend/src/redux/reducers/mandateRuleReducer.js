import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../lib/axios";

//fetch employer
const API_ENDPOINT = `/mandate-rule`;

// Thunk to fetch employer from the API
export const fetchMandateRules = createAsyncThunk(
  "mandateRule/fetchMandateRules",
  async () => {
    const response = await apiClient.get(API_ENDPOINT);
    console.log(response.data.mandateRules)
    return response.data.mandateRules;
  }
);

// employer slice
const mandateRuleSlice = createSlice({
  name: "mandateRule",
  initialState: {
    mandateRules: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMandateRules.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMandateRules.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.mandateRules = action.payload;
      })
      .addCase(fetchMandateRules.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default mandateRuleSlice.reducer;
