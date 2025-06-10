import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../lib/axios";

const API_ENDPOINT = `/credit-analysis`;

// Thunk to fetch All Customers and their Loan from the API
export const fetchAllCreditAnalysis = createAsyncThunk(
  "creditAnalysis/fetchAllCreditAnalysis",
  async ({ searchTerm, dateFilter, sort }) => {
    let pathurl = API_ENDPOINT;
    if (searchTerm) {
      pathurl = pathurl + `?search=${searchTerm}`;
      if (dateFilter) {
        pathurl = pathurl + `&dateFilter=${dateFilter}`;
      }
    }
    if (dateFilter) {
      pathurl = pathurl + `?dateFilter=${dateFilter}`;
    }

    const response = await apiClient.get(`${pathurl}`);

    return response.data;
  }
);

// Thunk to fetch Single Customer and Loan
export const fetchSingleCreditAnalysis = createAsyncThunk(
  "creditAnalysis/fetchSingleCreditAnalysis",
  async (analysisId) => {
    const response = await apiClient.get(`${API_ENDPOINT}/${analysisId}`);

    return response.data;
  }
);

// customer slice
const creditAnalysisSlice = createSlice({
  name: "creditAnalysis",
  initialState: {
    creditAnalysis: [],
    selectedCreditAnalysis: null,
    status: "idle",
    error: null,
  },
  reducers: {
    updateSelectedCreditAnalysis: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCreditAnalysis.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCreditAnalysis.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.creditAnalysis = action.payload;
      })
      .addCase(fetchAllCreditAnalysis.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchSingleCreditAnalysis.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSingleCreditAnalysis.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedCreditAnalysis = action.payload;
      })
      .addCase(fetchSingleCreditAnalysis.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateSelectedCreditAnalysis } = creditAnalysisSlice.actions;

export default creditAnalysisSlice.reducer;
