import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//fetch accounts
const apiUrl = import.meta.env.VITE_BASE_URL;

const API_ENDPOINT = `${apiUrl}/api/account-officers`;

// Thunk to fetch Loan Officers from the API
export const fetchAllLoanOfficers = createAsyncThunk(
  "account/fetchAllLoanOfficers",
  async () => {
    const response = await axios.get(`${API_ENDPOINT}/`);
    return response.data;
  }
);
// Thunk to fetch Single Loan Officer
export const fetchSingleLoanOfficers = createAsyncThunk(
  "account/fetchSingleCustomer",
  async (customerId) => {
    const response = await axios.get(`${API_ENDPOINT}/customer/${customerId}`);

    return response.data;
  }
);

// customer slice
const loanOfficerSlice = createSlice({
  name: "loanOfficers",
  initialState: {
    allLoanOfficers: null,
    selectedLoanOfficer: null,
    status: "idle",
    error: null,
  },
  reducers: {
    updateCustomerStateValues: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLoanOfficers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllLoanOfficers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.allLoanOfficers = action.payload;
      })
      .addCase(fetchAllLoanOfficers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchSingleLoanOfficers.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSingleLoanOfficers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedLoanOfficer = action.payload;
      })
      .addCase(fetchSingleLoanOfficers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateLoanOfficerStateValues } = loanOfficerSlice.actions;

export default loanOfficerSlice.reducer;
