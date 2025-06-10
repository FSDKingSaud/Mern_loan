import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../lib/axios";

const API_ENDPOINT = `/customers-loans`;

// Thunk to fetch All Customers and their Loan from the API
export const fetchAllCustomersLoans = createAsyncThunk(
  "customersLoans/fetchAllCustomersLoans",
  async ({ searchTerm, dateFilter , sort }) => {
    
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
export const fetchSingleCustomerLoans = createAsyncThunk(
  "customersLoans/fetchSingleCustomerLoans",
  async (customerId) => {
    const response = await apiClient.get(`${API_ENDPOINT}/${customerId}`);

    return response.data;
  }
);

// customer slice
const customersLoansSlice = createSlice({
  name: "customersLoans",
  initialState: {
    customersAndLoans: [],
    selectedCustomerAndLoan: null,
    loanFirstInfo: null,
    status: "idle",
    error: null,
  },
  reducers: {
    updateSelectedCustomerLoanState: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCustomersLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllCustomersLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.customersAndLoans = action.payload;
      })
      .addCase(fetchAllCustomersLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchSingleCustomerLoans.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchSingleCustomerLoans.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.selectedCustomerAndLoan = action.payload;
      })
      .addCase(fetchSingleCustomerLoans.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { updateSelectedCustomerLoanState } = customersLoansSlice.actions;

export default customersLoansSlice.reducer;
